package com.example.jobapp.service;

import com.example.jobapp.DTOs.AdminDTO;
import com.example.jobapp.Entity.Admin;
import com.example.jobapp.exception.AppException;
import com.example.jobapp.repository.AdminRepository;
import com.example.jobapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository     adminRepo;
    private final AuthenticationManager authManager;
    private final JwtUtil             jwtUtil;
    private final PasswordEncoder     passwordEncoder;
    private final OtpService          otpService;

    // ─── Register ────────────────────────────────────────────────────────────

    @Transactional
    public AdminDTO.AdminInfo register(AdminDTO.RegisterRequest req) {
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw AppException.badRequest("Mật khẩu xác nhận không khớp");
        }
        if (adminRepo.existsByUsername(req.getUsername())) {
            throw AppException.conflict("Username đã tồn tại");
        }
        if (adminRepo.existsByEmail(req.getEmail())) {
            throw AppException.conflict("Email đã được sử dụng");
        }

        // FE gửi password → DTO nhận (không lưu) → Service hash → lưu password_hash
        Admin admin = Admin.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();

        adminRepo.save(admin);
        log.info("Register success: username={}", admin.getUsername());

        return toAdminInfo(admin);
    }

    // ─── Login ───────────────────────────────────────────────────────────────

    public AdminDTO.LoginResponse login(AdminDTO.LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        Admin admin = adminRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> AppException.notFound("Admin không tồn tại"));

        String accessToken  = jwtUtil.generateAccessToken(admin.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(admin.getUsername());

        log.info("Login success: username={}", admin.getUsername());
        return buildLoginResponse(admin, accessToken, refreshToken);
    }

    // ─── Refresh token ────────────────────────────────────────────────────────

    public AdminDTO.LoginResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken) || !jwtUtil.isRefreshToken(refreshToken)) {
            throw AppException.unauthorized("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("Admin không tồn tại"));

        String newAccessToken = jwtUtil.generateAccessToken(username);
        log.info("Token refreshed: username={}", username);
        return buildLoginResponse(admin, newAccessToken, refreshToken);
    }

    // ─── Change Password ──────────────────────────────────────────────────────
    // Luồng: FE gửi oldPassword + newPassword + confirmPassword
    //        → DTO nhận (không lưu DB)
    //        → Service xử lý logic
    //        → hash(newPassword) → lưu password_hash ✓

    @Transactional
    public void changePassword(String username, AdminDTO.ChangePasswordRequest req) {
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("Admin không tồn tại"));

        // Xác thực oldPassword với password_hash trong DB
        if (!passwordEncoder.matches(req.getOldPassword(), admin.getPasswordHash())) {
            throw AppException.badRequest("Mật khẩu cũ không chính xác");
        }

        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw AppException.badRequest("Mật khẩu mới và xác nhận không khớp");
        }

        if (passwordEncoder.matches(req.getNewPassword(), admin.getPasswordHash())) {
            throw AppException.badRequest("Mật khẩu mới không được trùng mật khẩu cũ");
        }

        // hash(newPassword) → lưu password_hash vào DB
        admin.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        adminRepo.save(admin);
        log.info("Password changed: username={}", username);
    }

    // ─── Forgot Password — B1: gửi OTP về email ──────────────────────────────

    public void sendForgotPasswordOtp(AdminDTO.ForgotPasswordRequest req) {
        // Không tiết lộ email có tồn tại hay không (security)
        adminRepo.findByEmail(req.getEmail()).ifPresent(admin ->
            otpService.sendOtp(req.getEmail(), "[JobAdmin] Mã OTP đặt lại mật khẩu")
        );
        log.info("Forgot password OTP requested for email={}", req.getEmail());
    }

    // ─── Forgot Password — B2: xác thực OTP + đặt mật khẩu mới ─────────────
    // Luồng: FE gửi email + otp + newPassword + confirmPassword
    //        → DTO nhận (không lưu DB)
    //        → Service verify OTP
    //        → hash(newPassword) → lưu password_hash ✓

    @Transactional
    public void resetPassword(AdminDTO.ResetPasswordRequest req) {
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw AppException.badRequest("Mật khẩu xác nhận không khớp");
        }

        // Xác thực OTP (không lưu OTP vào DB — lưu in-memory)
        if (!otpService.verify(req.getEmail(), req.getOtp())) {
            throw AppException.badRequest("OTP không hợp lệ hoặc đã hết hạn");
        }

        Admin admin = adminRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> AppException.notFound("Tài khoản không tồn tại"));

        // hash(newPassword) → lưu password_hash vào DB
        admin.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        adminRepo.save(admin);

        otpService.invalidate(req.getEmail()); // xoá OTP sau khi dùng
        log.info("Password reset success: email={}", req.getEmail());
    }

    // ─── Update Profile ───────────────────────────────────────────────────────

    @Transactional
    public AdminDTO.AdminInfo updateProfile(String username, AdminDTO.UpdateProfileRequest req) {
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("Admin không tồn tại"));

        if (req.getEmail() != null && !req.getEmail().equals(admin.getEmail())) {
            if (adminRepo.existsByEmail(req.getEmail())) {
                throw AppException.conflict("Email đã được sử dụng");
            }
            admin.setEmail(req.getEmail());
        }

        adminRepo.save(admin);
        log.info("Profile updated: username={}", username);
        return toAdminInfo(admin);
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private AdminDTO.LoginResponse buildLoginResponse(Admin admin, String access, String refresh) {
        return AdminDTO.LoginResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .expiresIn(900L)
                .admin(toAdminInfo(admin))
                .build();
    }

    private AdminDTO.AdminInfo toAdminInfo(Admin admin) {
        return AdminDTO.AdminInfo.builder()
                .id(admin.getId())
                .username(admin.getUsername())
                .email(admin.getEmail())
                .createdAt(admin.getCreatedAt())
                .build();
    }
    // ─── Get Profile ─────────────────────────────────────────────────────────

    public AdminDTO.AdminInfo getProfile(String username) {
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("Admin không tồn tại"));
        return toAdminInfo(admin);
    }
}

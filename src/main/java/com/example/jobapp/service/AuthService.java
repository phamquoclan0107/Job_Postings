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

    // ─── Login ─────────────────────────────────────────────────────────────────

    public AdminDTO.LoginResponse login(AdminDTO.LoginRequest req) {
        // Spring Security ném BadCredentialsException nếu sai — GlobalHandler xử lý
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

    // ─── Refresh token ─────────────────────────────────────────────────────────

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

    // ─── Change password ───────────────────────────────────────────────────────

    @Transactional
    public void changePassword(String username, AdminDTO.ChangePasswordRequest req) {
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("Admin không tồn tại"));

        if (!passwordEncoder.matches(req.getOldPassword(), admin.getPasswordHash())) {
            throw AppException.badRequest("Mật khẩu cũ không chính xác");
        }

        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw AppException.badRequest("Mật khẩu mới và xác nhận không khớp");
        }

        if (passwordEncoder.matches(req.getNewPassword(), admin.getPasswordHash())) {
            throw AppException.badRequest("Mật khẩu mới không được trùng mật khẩu cũ");
        }

        admin.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        adminRepo.save(admin);
        log.info("Password changed: username={}", username);
    }

    // ─── Update profile ────────────────────────────────────────────────────────

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

        return AdminDTO.AdminInfo.builder()
                .id(admin.getId())
                .username(admin.getUsername())
                .email(admin.getEmail())
                .createdAt(admin.getCreatedAt())
                .build();
    }

    // ─── Private ───────────────────────────────────────────────────────────────

    private AdminDTO.LoginResponse buildLoginResponse(Admin admin, String access, String refresh) {
        return AdminDTO.LoginResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .expiresIn(900L) // 15 phút tính bằng giây
                .admin(AdminDTO.AdminInfo.builder()
                        .id(admin.getId())
                        .username(admin.getUsername())
                        .email(admin.getEmail())
                        .createdAt(admin.getCreatedAt())
                        .build())
                .build();
    }
}
package com.example.jobapp.Controller;

import com.example.jobapp.common.ApiResponse;
import com.example.jobapp.DTOs.AdminDTO;
import com.example.jobapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Auth endpoints — public (không cần JWT).
 *
 * POST /api/auth/register          — đăng ký tài khoản
 * POST /api/auth/login             — đăng nhập
 * POST /api/auth/refresh-token     — lấy access token mới
 * POST /api/auth/forgot-password   — gửi OTP về email
 * POST /api/auth/reset-password    — xác thực OTP + đặt mật khẩu mới
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ─── Register ────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AdminDTO.AdminInfo>> register(
            @Valid @RequestBody AdminDTO.RegisterRequest req) {
        AdminDTO.AdminInfo info = authService.register(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("Đăng ký thành công", info));
    }

    // ─── Login ───────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AdminDTO.LoginResponse>> login(
            @Valid @RequestBody AdminDTO.LoginRequest req) {
        AdminDTO.LoginResponse resp = authService.login(req);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", resp));
    }

    // ─── Refresh token ────────────────────────────────────────────────────────

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AdminDTO.LoginResponse>> refreshToken(
            @Valid @RequestBody AdminDTO.RefreshTokenRequest req) {
        AdminDTO.LoginResponse resp = authService.refreshToken(req.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok("Token đã được làm mới", resp));
    }

    // ─── Forgot Password — B1: gửi OTP ───────────────────────────────────────

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody AdminDTO.ForgotPasswordRequest req) {
        authService.sendForgotPasswordOtp(req);
        return ResponseEntity.ok(ApiResponse.noContent(
                "Nếu email tồn tại, mã OTP đã được gửi. Kiểm tra hộp thư của bạn."));
    }

    // ─── Forgot Password — B2: xác thực OTP + reset mật khẩu ────────────────

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody AdminDTO.ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(ApiResponse.noContent("Đặt lại mật khẩu thành công"));
    }
}

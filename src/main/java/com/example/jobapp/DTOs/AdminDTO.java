package com.example.jobapp.DTOs;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class AdminDTO {

    // ─── Login ───────────────────────────────────────────────────────────────

    @Getter @Setter
    public static class LoginRequest {
        @NotBlank(message = "Username không được để trống")
        private String username;

        @NotBlank(message = "Password không được để trống")
        private String password;
    }

    @Getter @Setter
    public static class RefreshTokenRequest {
        @NotBlank(message = "Refresh token không được để trống")
        private String refreshToken;
    }

    // ─── Register ────────────────────────────────────────────────────────────

    @Getter @Setter
    public static class RegisterRequest {
        @NotBlank(message = "Username không được để trống")
        @Size(min = 3, max = 50, message = "Username từ 3-50 ký tự")
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username chỉ gồm chữ, số và dấu _")
        private String username;

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        @Size(max = 100)
        private String email;

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, max = 100, message = "Mật khẩu từ 6-100 ký tự")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Mật khẩu phải chứa ít nhất 1 chữ và 1 số")
        private String password;

        @NotBlank(message = "Xác nhận mật khẩu không được để trống")
        private String confirmPassword;
    }

    // ─── Change Password ──────────────────────────────────────────────────────
    // Luồng: FE gửi 3 field → DTO nhận (không lưu DB) → Service hash → lưu password_hash

    @Getter @Setter
    public static class ChangePasswordRequest {
        @NotBlank(message = "Mật khẩu cũ không được để trống")
        private String oldPassword;       // FE → DTO (không lưu DB)

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 6, max = 100, message = "Mật khẩu mới từ 6-100 ký tự")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Mật khẩu mới phải chứa ít nhất 1 chữ và 1 số")
        private String newPassword;       // FE → DTO (không lưu DB)

        @NotBlank(message = "Xác nhận mật khẩu không được để trống")
        private String confirmPassword;   // FE → DTO (không lưu DB)
        // Service: verify oldPassword → hash(newPassword) → lưu password_hash ✓
    }

    // ─── Forgot Password — B1: gửi OTP về email ──────────────────────────────

    @Getter @Setter
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        private String email;
    }

    // ─── Forgot Password — B2: xác thực OTP + đặt mật khẩu mới ─────────────
    // Luồng: FE gửi email + otp + newPassword + confirmPassword
    //        → DTO nhận (không lưu DB) → Service verify OTP → hash → lưu password_hash

    @Getter @Setter
    public static class ResetPasswordRequest {
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        private String email;

        @NotBlank(message = "OTP không được để trống")
        @Size(min = 6, max = 6, message = "OTP gồm 6 chữ số")
        private String otp;               // FE → DTO (không lưu DB)

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 6, max = 100, message = "Mật khẩu từ 6-100 ký tự")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Mật khẩu phải chứa ít nhất 1 chữ và 1 số")
        private String newPassword;       // FE → DTO (không lưu DB)

        @NotBlank(message = "Xác nhận mật khẩu không được để trống")
        private String confirmPassword;   // FE → DTO (không lưu DB)
        // Service: verify OTP → hash(newPassword) → lưu password_hash ✓
    }

    // ─── Update Profile ───────────────────────────────────────────────────────

    @Getter @Setter
    public static class UpdateProfileRequest {
        @Email(message = "Email không đúng định dạng")
        @Size(max = 100)
        private String email;
    }

    // ─── Responses ────────────────────────────────────────────────────────────

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private long expiresIn;
        private AdminInfo admin;
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class AdminInfo {
        private Integer id;
        private String username;
        private String email;
        private LocalDateTime createdAt;
    }
}

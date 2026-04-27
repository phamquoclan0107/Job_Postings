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

    @Getter @Setter
    public static class ChangePasswordRequest {
        @NotBlank(message = "Mật khẩu cũ không được để trống")
        private String oldPassword;

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 6, max = 100, message = "Mật khẩu mới từ 6-100 ký tự")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Mật khẩu mới phải chứa ít nhất 1 chữ và 1 số")
        private String newPassword;

        @NotBlank(message = "Xác nhận mật khẩu không được để trống")
        private String confirmPassword;
    }

    // ─── Forgot Password ──────────────────────────────────────────────────────

    @Getter @Setter
    public static class ForgotPasswordRequest {
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        private String email;
    }

    @Getter @Setter
    public static class ResetPasswordRequest {
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        private String email;

        @NotBlank(message = "OTP không được để trống")
        @Size(min = 6, max = 6, message = "OTP gồm 6 chữ số")
        private String otp;

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 6, max = 100, message = "Mật khẩu từ 6-100 ký tự")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Mật khẩu phải chứa ít nhất 1 chữ và 1 số")
        private String newPassword;

        @NotBlank(message = "Xác nhận mật khẩu không được để trống")
        private String confirmPassword;
    }

    // ─── Update Profile — MỞ RỘNG thêm fullName, phone ──────────────────────

    @Getter @Setter
    public static class UpdateProfileRequest {
        @Email(message = "Email không đúng định dạng")
        @Size(max = 100)
        private String email;

        @Size(max = 100, message = "Họ và tên tối đa 100 ký tự")
        private String fullName;

        @Pattern(regexp = "^(\\+?[0-9\\s\\-]{7,20})?$", message = "Số điện thoại không hợp lệ")
        private String phone;
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
        private String fullName;   // THÊM MỚI
        private String phone;      // THÊM MỚI
        private LocalDateTime createdAt;
    }
}
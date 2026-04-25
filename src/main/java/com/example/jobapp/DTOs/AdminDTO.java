package com.example.jobapp.DTOs;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class AdminDTO {

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

    @Getter @Setter
    public static class UpdateProfileRequest {
        @Email(message = "Email không đúng định dạng")
        @Size(max = 100)
        private String email;
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private long expiresIn;        // seconds
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
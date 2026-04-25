package com.example.jobapp.DTOs;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

// ============================================================
//  ADMIN DTOs
// ============================================================

public class AdminDTO {

    // --------------------------------------------------------
    // Request: Đăng nhập
    // --------------------------------------------------------
    @Getter @Setter
    public static class LoginRequest {

        @NotBlank(message = "Username không được để trống")
        @Size(min = 3, max = 50, message = "Username từ 3–50 ký tự")
        private String username;

        @NotBlank(message = "Password không được để trống")
        @Size(min = 6, message = "Password tối thiểu 6 ký tự")
        private String password;
    }

    // --------------------------------------------------------
    // Request: Đổi mật khẩu
    // --------------------------------------------------------
    @Getter @Setter
    public static class ChangePasswordRequest {

        @NotBlank(message = "Mật khẩu cũ không được để trống")
        private String oldPassword;

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 6, max = 100, message = "Mật khẩu mới từ 6–100 ký tự")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Mật khẩu mới phải chứa ít nhất 1 chữ và 1 số"
        )
        private String newPassword;

        @NotBlank(message = "Xác nhận mật khẩu không được để trống")
        private String confirmPassword;
    }

    // --------------------------------------------------------
    // Response: Thông tin admin trả về (không bao giờ trả password)
    // --------------------------------------------------------
    @Getter @Setter
    @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer id;
        private String username;
        private String email;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}

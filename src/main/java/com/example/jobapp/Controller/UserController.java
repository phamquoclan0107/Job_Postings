package com.example.jobapp.Controller;

import com.example.jobapp.common.ApiResponse;
import com.example.jobapp.DTOs.AdminDTO;
import com.example.jobapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * User endpoints — cần JWT.
 *
 * PUT /api/users/change-password  — đổi mật khẩu (oldPass + newPass + confirmPass)
 * PUT /api/users/me               — cập nhật thông tin cá nhân
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    // ─── Change Password ──────────────────────────────────────────────────────
    // Luồng: FE gửi oldPassword + newPassword + confirmPassword
    //        → DTO nhận (không lưu DB)
    //        → Service xử lý logic → hash → lưu password_hash ✓

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AdminDTO.ChangePasswordRequest req) {
        authService.changePassword(userDetails.getUsername(), req);
        return ResponseEntity.ok(ApiResponse.noContent("Đổi mật khẩu thành công"));
    }

    // ─── Update Profile ───────────────────────────────────────────────────────

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<AdminDTO.AdminInfo>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AdminDTO.UpdateProfileRequest req) {
        AdminDTO.AdminInfo info = authService.updateProfile(userDetails.getUsername(), req);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin thành công", info));
    }
}

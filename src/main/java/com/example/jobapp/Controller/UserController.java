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
 * GET  /api/users/me               — lấy thông tin profile
 * PUT  /api/users/me               — cập nhật thông tin cá nhân
 * PUT  /api/users/change-password  — đổi mật khẩu
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    // ─── Get Profile ──────────────────────────────────────────────────────────

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AdminDTO.AdminInfo>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        AdminDTO.AdminInfo info = authService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Lấy thông tin thành công", info));
    }

    // ─── Update Profile ───────────────────────────────────────────────────────

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<AdminDTO.AdminInfo>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AdminDTO.UpdateProfileRequest req) {
        AdminDTO.AdminInfo info = authService.updateProfile(userDetails.getUsername(), req);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin thành công", info));
    }

    // ─── Change Password ──────────────────────────────────────────────────────

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AdminDTO.ChangePasswordRequest req) {
        authService.changePassword(userDetails.getUsername(), req);
        return ResponseEntity.ok(ApiResponse.noContent("Đổi mật khẩu thành công"));
    }
}
package com.example.jobapp.DTOs;

import com.example.jobapp.Entity.JobPosting.JobStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// ============================================================
//  JOB POSTING DTOs
// ============================================================

public class JobPostingDTO {

    // --------------------------------------------------------
    // Request: Tạo mới tin tuyển dụng
    // --------------------------------------------------------
    @Getter @Setter
    public static class CreateRequest {

        @NotNull(message = "Vị trí tuyển dụng (category) không được để trống")
        private Integer categoryId;

        @NotBlank(message = "Tiêu đề không được để trống")
        @Size(min = 5, max = 200, message = "Tiêu đề từ 5–200 ký tự")
        private String title;

        @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
        private String description;

        @Size(max = 5000, message = "Yêu cầu tối đa 5000 ký tự")
        private String requirements;

        @Size(max = 5000, message = "Quyền lợi tối đa 5000 ký tự")
        private String benefits;

        @Size(max = 5000, message = "Điểm hấp dẫn tối đa 5000 ký tự")
        private String interest;

        @Size(max = 200, message = "Địa điểm tối đa 200 ký tự")
        private String location;

        @NotBlank(message = "Email liên hệ không được để trống")
        @Email(message = "Email liên hệ không đúng định dạng")
        @Size(max = 100, message = "Email tối đa 100 ký tự")
        private String contactEmail;

        @Pattern(
                regexp = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$",
                message = "Số điện thoại không đúng định dạng Việt Nam"
        )
        private String contactPhone;

        @NotNull(message = "Trạng thái không được để trống")
        private JobStatus status;

        @Future(message = "Ngày hết hạn phải lớn hơn ngày hiện tại")
        private LocalDate expiresAt;
    }

    // --------------------------------------------------------
    // Request: Cập nhật tin tuyển dụng
    //   — Dùng riêng để admin có thể partial update
    //   — Tất cả field đều optional (nullable), validate khi có giá trị
    // --------------------------------------------------------
    @Getter @Setter
    public static class UpdateRequest {

        private Integer categoryId;

        @Size(min = 5, max = 200, message = "Tiêu đề từ 5–200 ký tự")
        private String title;

        @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
        private String description;

        @Size(max = 5000, message = "Yêu cầu tối đa 5000 ký tự")
        private String requirements;

        @Size(max = 5000, message = "Quyền lợi tối đa 5000 ký tự")
        private String benefits;

        @Size(max = 5000, message = "Điểm hấp dẫn tối đa 5000 ký tự")
        private String interest;

        @Size(max = 200, message = "Địa điểm tối đa 200 ký tự")
        private String location;

        @Email(message = "Email liên hệ không đúng định dạng")
        @Size(max = 100)
        private String contactEmail;

        @Pattern(
                regexp = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$",
                message = "Số điện thoại không đúng định dạng Việt Nam"
        )
        private String contactPhone;

        private JobStatus status;

        @Future(message = "Ngày hết hạn phải lớn hơn ngày hiện tại")
        private LocalDate expiresAt;
    }

    // --------------------------------------------------------
    // Response: Trả về danh sách (gọn)
    // --------------------------------------------------------
    @Getter @Setter
    @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class SummaryResponse {
        private Integer id;
        private String title;
        private String categoryName;
        private String location;
        private String contactEmail;
        private String contactPhone;
        private JobStatus status;
        private LocalDate expiresAt;
        private LocalDateTime createdAt;
    }

    // --------------------------------------------------------
    // Response: Trả về chi tiết (đầy đủ)
    // --------------------------------------------------------
    @Getter @Setter
    @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class DetailResponse {
        private Integer id;
        private Integer categoryId;
        private String categoryName;
        private Integer adminId;
        private String title;
        private String description;
        private String requirements;
        private String benefits;
        private String interest;
        private String location;
        private String contactEmail;
        private String contactPhone;
        private JobStatus status;
        private LocalDate expiresAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}

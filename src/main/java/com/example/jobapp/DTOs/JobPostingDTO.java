package com.example.jobapp.DTOs;

import com.example.jobapp.Entity.JobPosting.JobStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobPostingDTO {

    @Getter @Setter
    public static class CreateRequest {

        @NotNull(message = "Danh mục không được để trống")
        private Integer categoryId;

        @NotBlank(message = "Tiêu đề không được để trống")
        @Size(min = 5, max = 200, message = "Tiêu đề từ 5-200 ký tự")
        private String title;

        @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
        private String description;

        private BigDecimal salary;

        @Size(max = 200, message = "Địa điểm tối đa 200 ký tự")
        private String location;

        @Size(max = 500, message = "URL ảnh tối đa 500 ký tự")
        private String imageUrl;

        @NotNull(message = "Trạng thái không được để trống")
        private JobStatus status;

        @Future(message = "Ngày hết hạn phải lớn hơn ngày hiện tại")
        private LocalDate expiresAt;
    }

    @Getter @Setter
    public static class UpdateRequest {
        private Integer categoryId;

        @Size(min = 5, max = 200)
        private String title;

        @Size(max = 5000)
        private String description;

        private BigDecimal salary;

        @Size(max = 200)
        private String location;

        @Size(max = 500)
        private String imageUrl;

        private JobStatus status;

        @Future
        private LocalDate expiresAt;
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class SummaryResponse {
        private Integer id;
        private String title;
        private Integer categoryId;
        private String categoryName;
        private BigDecimal salary;
        private String location;
        private String imageUrl;
        private JobStatus status;
        private LocalDate expiresAt;
        private LocalDateTime createdAt;
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class DetailResponse {
        private Integer id;
        private Integer categoryId;
        private String categoryName;
        private Integer adminId;
        private String title;
        private String description;
        private BigDecimal salary;
        private String location;
        private String imageUrl;
        private JobStatus status;
        private LocalDate expiresAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
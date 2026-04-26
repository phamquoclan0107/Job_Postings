package com.example.jobapp.DTOs;

import com.example.jobapp.Entity.JobPosting.IncomeLevel;
import com.example.jobapp.Entity.JobPosting.JobStatus;
import com.example.jobapp.Entity.JobPosting.JobType;
import jakarta.validation.constraints.*;
import lombok.*;

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

        @Size(max = 200, message = "Tên công ty tối đa 200 ký tự")
        private String companyName;

        @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
        private String description;

        private String benefits;

        private String requirements;

        @Size(max = 200, message = "Địa điểm tối đa 200 ký tự")
        private String location;

        private JobType jobType;

        @Size(max = 100, message = "Cấp độ kinh nghiệm tối đa 100 ký tự")
        private String experienceLevel;

        private IncomeLevel incomeLevel;

        @NotNull(message = "Trạng thái không được để trống")
        private JobStatus status;

        @NotBlank(message = "Email liên hệ không được để trống")
        @Email(message = "Email liên hệ không đúng định dạng")
        @Size(max = 255)
        private String contactEmail;

        @Future(message = "Ngày hết hạn phải lớn hơn ngày hiện tại")
        private LocalDate expiresAt;
    }

    @Getter @Setter
    public static class UpdateRequest {
        private Integer categoryId;

        @Size(min = 5, max = 200)
        private String title;

        @Size(max = 200)
        private String companyName;

        @Size(max = 5000)
        private String description;

        private String benefits;

        private String requirements;

        @Size(max = 200)
        private String location;

        private JobType jobType;

        @Size(max = 100)
        private String experienceLevel;

        private IncomeLevel incomeLevel;

        private JobStatus status;

        @Email
        @Size(max = 255)
        private String contactEmail;

        @Future
        private LocalDate expiresAt;
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class SummaryResponse {
        private Integer id;
        private String title;
        private String companyName;
        private Integer categoryId;
        private String categoryName;
        private JobType jobType;
        private String experienceLevel;
        private IncomeLevel incomeLevel;
        private String location;
        private JobStatus status;
        private LocalDate expiresAt;
        private LocalDateTime postedAt;
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
        private String companyName;
        private String description;
        private JobType jobType;
        private String experienceLevel;
        private IncomeLevel incomeLevel;
        private String benefits;
        private String requirements;
        private String location;
        private JobStatus status;
        private String contactEmail;
        private LocalDate expiresAt;
        private LocalDateTime postedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
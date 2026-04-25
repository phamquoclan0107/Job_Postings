package com.example.jobapp.DTOs;

import com.example.jobapp.Entity.Category.CategoryType;
//        yourcompany.recruitment.entity.Category.CategoryType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

// ============================================================
//  CATEGORY DTOs
// ============================================================

public class CategoryDTO {

    // --------------------------------------------------------
    // Request: Tạo mới / Cập nhật danh mục
    // --------------------------------------------------------
    @Getter @Setter
    public static class Request {

        @NotBlank(message = "Tên danh mục không được để trống")
        @Size(min = 2, max = 100, message = "Tên danh mục từ 2–100 ký tự")
        private String name;

        @NotNull(message = "Loại danh mục không được để trống")
        private CategoryType type; // job | product
    }

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------
    @Getter @Setter
    @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer id;
        private String name;
        private CategoryType type;
        private LocalDateTime createdAt;
    }
}

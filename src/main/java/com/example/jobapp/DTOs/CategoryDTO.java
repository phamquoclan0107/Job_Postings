package com.example.jobapp.DTOs;

import com.example.jobapp.Entity.Category.CategoryType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

public class CategoryDTO {

    @Getter @Setter
    public static class Request {
        @NotBlank(message = "Tên danh mục không được để trống")
        @Size(min = 2, max = 100, message = "Tên danh mục từ 2-100 ký tự")
        private String name;

        @NotNull(message = "Loại danh mục không được để trống (JOB hoặc PRODUCT)")
        private CategoryType type;
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer id;
        private String name;
        private CategoryType type;
        private LocalDateTime createdAt;
    }
}
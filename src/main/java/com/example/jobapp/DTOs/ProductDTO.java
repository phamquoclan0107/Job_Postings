package com.example.jobapp.DTOs;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

// ============================================================
//  PRODUCT DTOs
// ============================================================

public class ProductDTO {

    // --------------------------------------------------------
    // Request: Tạo mới sản phẩm
    // --------------------------------------------------------
    @Getter @Setter
    public static class CreateRequest {

        @NotNull(message = "Danh mục sản phẩm không được để trống")
        private Integer categoryId;

        @NotBlank(message = "Tên sản phẩm không được để trống")
        @Size(min = 2, max = 200, message = "Tên sản phẩm từ 2–200 ký tự")
        private String name;

        @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
        private String description;

        @Size(max = 500, message = "URL ảnh tối đa 500 ký tự")
        @Pattern(
                regexp = "^(https?://.*|/.*)?$",
                message = "URL ảnh phải bắt đầu bằng http://, https://, hoặc /"
        )
        private String imageUrl;

        private Boolean isActive = true;
    }

    // --------------------------------------------------------
    // Request: Cập nhật sản phẩm
    // --------------------------------------------------------
    @Getter @Setter
    public static class UpdateRequest {

        private Integer categoryId;

        @Size(min = 2, max = 200, message = "Tên sản phẩm từ 2–200 ký tự")
        private String name;

        @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
        private String description;

        @Size(max = 500, message = "URL ảnh tối đa 500 ký tự")
        @Pattern(
                regexp = "^(https?://.*|/.*)?$",
                message = "URL ảnh phải bắt đầu bằng http://, https://, hoặc /"
        )
        private String imageUrl;

        private Boolean isActive;
    }

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------
    @Getter @Setter
    @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer id;
        private Integer categoryId;
        private String categoryName;
        private String name;
        private String description;
        private String imageUrl;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}

package com.example.jobapp.DTOs;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class ProductDTO {

    @Getter @Setter
    public static class CreateRequest {

        @NotNull(message = "Danh mục không được để trống")
        private Integer categoryId;

        @NotBlank(message = "Mã sản phẩm không được để trống")
        @Size(max = 50, message = "Mã sản phẩm tối đa 50 ký tự")
        @Pattern(regexp = "^[A-Z0-9_-]+$",
                message = "Mã sản phẩm chỉ chứa chữ hoa, số, dấu gạch")
        private String productCode;

        @NotBlank(message = "Tên sản phẩm không được để trống")
        @Size(min = 2, max = 200, message = "Tên sản phẩm từ 2-200 ký tự")
        private String name;

        @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
        private String description;

        private Boolean isActive = true;
    }

    @Getter @Setter
    public static class UpdateRequest {
        private Integer categoryId;

        @Size(min = 2, max = 200)
        private String name;

        @Size(max = 5000)
        private String description;

        private Boolean isActive;
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer id;
        private String productCode;
        private Integer categoryId;
        private String categoryName;
        private String name;
        private String description;
        private Boolean isActive;
        private List<ProductImageDTO.Response> images;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
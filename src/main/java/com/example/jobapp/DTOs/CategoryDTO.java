package com.example.jobapp.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

public class CategoryDTO {

    @Getter @Setter
    public static class Request {

        @NotBlank(message = "Tên danh mục không được để trống")
        @Size(max = 100, message = "Tên tối đa 100 ký tự")
        private String name;

        @NotBlank(message = "Loại danh mục không được để trống")
        private String type; // "JOB" hoặc "PRODUCT"
    }

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer id;
        private String name;
        private String type;
        private LocalDateTime createdAt;
    }
}
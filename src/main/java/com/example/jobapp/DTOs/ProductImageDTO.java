package com.example.jobapp.DTOs;

import lombok.*;

import java.time.LocalDateTime;

public class ProductImageDTO {

    @Getter @Setter @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer id;
        private String fileName;
        private String url;
        private Integer sortOrder;
        private LocalDateTime createdAt;
    }
}
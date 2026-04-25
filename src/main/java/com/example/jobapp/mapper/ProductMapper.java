package com.example.jobapp.mapper;

import com.example.jobapp.DTOs.ProductDTO;
import com.example.jobapp.DTOs.ProductImageDTO;
import com.example.jobapp.Entity.Product;
import com.example.jobapp.Entity.ProductImage;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class ProductMapper {

    public ProductDTO.Response toResponse(Product p) {
        List<ProductImageDTO.Response> images = (p.getImages() != null)
                ? p.getImages().stream().map(this::toImageResponse).toList()
                : Collections.emptyList();

        return ProductDTO.Response.builder()
                .id(p.getId())
                .productCode(p.getProductCode())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .name(p.getName())
                .description(p.getDescription())
                .isActive(p.getIsActive())
                .images(images)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    public ProductImageDTO.Response toImageResponse(ProductImage img) {
        return ProductImageDTO.Response.builder()
                .id(img.getId())
                .fileName(img.getFileName())
                .url(img.getUrl())
                .sortOrder(img.getSortOrder())
                .createdAt(img.getCreatedAt())
                .build();
    }
}
package com.example.jobapp.mapper;

import com.example.jobapp.DTOs.CategoryDTO;
import com.example.jobapp.Entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDTO.Response toResponse(Category c) {
        return CategoryDTO.Response.builder()
                .id(c.getId())
                .name(c.getName())
                .type(c.getType())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
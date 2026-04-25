package com.example.jobapp.mapper;

import com.example.jobapp.DTOs.JobPostingDTO;
import com.example.jobapp.Entity.JobPosting;
import org.springframework.stereotype.Component;

@Component
public class JobPostingMapper {

    public JobPostingDTO.SummaryResponse toSummary(JobPosting j) {
        return JobPostingDTO.SummaryResponse.builder()
                .id(j.getId())
                .title(j.getTitle())
                .categoryName(j.getCategory().getName())
                .salary(j.getSalary())
                .location(j.getLocation())
                .imageUrl(j.getImageUrl())
                .status(j.getStatus())
                .expiresAt(j.getExpiresAt())
                .createdAt(j.getCreatedAt())
                .build();
    }

    public JobPostingDTO.DetailResponse toDetail(JobPosting j) {
        return JobPostingDTO.DetailResponse.builder()
                .id(j.getId())
                .categoryId(j.getCategory().getId())
                .categoryName(j.getCategory().getName())
                .adminId(j.getAdmin().getId())
                .title(j.getTitle())
                .description(j.getDescription())
                .salary(j.getSalary())
                .location(j.getLocation())
                .imageUrl(j.getImageUrl())
                .status(j.getStatus())
                .expiresAt(j.getExpiresAt())
                .createdAt(j.getCreatedAt())
                .updatedAt(j.getUpdatedAt())
                .build();
    }
}
package com.example.jobapp.mapper;

import com.example.jobapp.DTOs.JobPostingDTO;
import com.example.jobapp.Entity.JobPosting;
import org.springframework.stereotype.Component;

@Component
public class JobPostingMapper {

    public JobPostingDTO.SummaryResponse toSummary(JobPosting job) {
        return JobPostingDTO.SummaryResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .categoryName(job.getCategory() != null ? job.getCategory().getName() : null)
                .categoryId(job.getCategory() != null ? job.getCategory().getId() : null)
                .salary(job.getSalary())
                .location(job.getLocation())
                .imageUrl(job.getImageUrl())
                .status(job.getStatus())
                .expiresAt(job.getExpiresAt())
                .createdAt(job.getCreatedAt())
                .build();
    }

    public JobPostingDTO.DetailResponse toDetail(JobPosting job) {
        return JobPostingDTO.DetailResponse.builder()
                .id(job.getId())
                .categoryId(job.getCategory() != null ? job.getCategory().getId() : null)
                .categoryName(job.getCategory() != null ? job.getCategory().getName() : null)
                .adminId(job.getAdmin() != null ? job.getAdmin().getId() : null)
                .title(job.getTitle())
                .description(job.getDescription())
                .salary(job.getSalary())
                .location(job.getLocation())
                .imageUrl(job.getImageUrl())
                .status(job.getStatus())
                .expiresAt(job.getExpiresAt())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
package com.example.jobapp.service;

import com.example.jobapp.DTOs.JobPostingDTO;
import com.example.jobapp.Entity.*;
import com.example.jobapp.Entity.JobPosting.JobStatus;
import com.example.jobapp.exception.AppException;
import com.example.jobapp.mapper.JobPostingMapper;
import com.example.jobapp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class JobPostingService {

    private final JobPostingRepository jobRepo;
    private final CategoryRepository   categoryRepo;
    private final AdminRepository      adminRepo;
    private final JobPostingMapper     mapper;

    @Transactional(readOnly = true)
    public List<JobPostingDTO.SummaryResponse> getAll() {
        return jobRepo.findAllActive()
                .stream()
                .map(mapper::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobPostingDTO.DetailResponse getById(Integer id) {
        JobPosting job = jobRepo.findActiveById(id)
                .orElseThrow(() -> AppException.notFound("Job Posting không tồn tại: " + id));
        return mapper.toDetail(job);
    }

    @Transactional(readOnly = true)
    public List<JobPostingDTO.SummaryResponse> getSimilar(Integer id, int limit) {
        JobPosting job = jobRepo.findActiveById(id)
                .orElseThrow(() -> AppException.notFound("Job Posting không tồn tại: " + id));
        Pageable pageable = PageRequest.of(0, limit);
        return jobRepo.findSimilar(job.getCategory().getId(), id, pageable)
                .stream()
                .map(mapper::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<JobPostingDTO.SummaryResponse> search(
            String keyword,
            String location,
            BigDecimal salaryMin,
            BigDecimal salaryMax,
            Integer categoryId,
            JobStatus status,
            Pageable pageable) {

        return jobRepo.search(
                        isBlank(keyword)  ? null : keyword,
                        isBlank(location) ? null : location,
                        salaryMin,
                        salaryMax,
                        categoryId,
                        status,
                        pageable
                )
                .map(mapper::toSummary);
    }

    public JobPostingDTO.DetailResponse create(JobPostingDTO.CreateRequest req) {
        validateSalaryRange(req.getSalaryMin(), req.getSalaryMax());

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("Admin không tồn tại"));

        Category category = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + req.getCategoryId()));

        // Validate category phải đúng loại JOB
        if (category.getType() != Category.CategoryType.JOB) {
            throw AppException.badRequest("Danh mục phải thuộc loại JOB");
        }

        JobPosting job = JobPosting.builder()
                .admin(admin)
                .category(category)
                .title(req.getTitle())
                .companyName(req.getCompanyName())
                .description(req.getDescription())
                .salaryMin(req.getSalaryMin())
                .salaryMax(req.getSalaryMax())
                .salaryType(req.getSalaryType())
                .jobType(req.getJobType())
                .experienceLevel(req.getExperienceLevel())
                .benefits(req.getBenefits())
                .requirements(req.getRequirements())
                .location(req.getLocation())
                .imageUrl(req.getImageUrl())
                .status(req.getStatus())
                .contactEmail(req.getContactEmail())
                .expiresAt(req.getExpiresAt())
                .build();

        JobPosting saved = jobRepo.save(job);
        log.info("Job created: id={}, title={}, admin={}", saved.getId(), saved.getTitle(), username);
        return mapper.toDetail(saved);
    }

    public JobPostingDTO.DetailResponse update(Integer id, JobPostingDTO.UpdateRequest req) {
        validateSalaryRange(req.getSalaryMin(), req.getSalaryMax());

        JobPosting job = jobRepo.findActiveById(id)
                .orElseThrow(() -> AppException.notFound("Job Posting không tồn tại: " + id));

        if (req.getCategoryId() != null) {
            Category cat = categoryRepo.findById(req.getCategoryId())
                    .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + req.getCategoryId()));
            if (cat.getType() != Category.CategoryType.JOB) {
                throw AppException.badRequest("Danh mục phải thuộc loại JOB");
            }
            job.setCategory(cat);
        }
        if (req.getTitle()           != null) job.setTitle(req.getTitle());
        if (req.getCompanyName()     != null) job.setCompanyName(req.getCompanyName());
        if (req.getDescription()     != null) job.setDescription(req.getDescription());
        if (req.getSalaryMin()       != null) job.setSalaryMin(req.getSalaryMin());
        if (req.getSalaryMax()       != null) job.setSalaryMax(req.getSalaryMax());
        if (req.getSalaryType()      != null) job.setSalaryType(req.getSalaryType());
        if (req.getJobType()         != null) job.setJobType(req.getJobType());
        if (req.getExperienceLevel() != null) job.setExperienceLevel(req.getExperienceLevel());
        if (req.getBenefits()        != null) job.setBenefits(req.getBenefits());
        if (req.getRequirements()    != null) job.setRequirements(req.getRequirements());
        if (req.getLocation()        != null) job.setLocation(req.getLocation());
        if (req.getImageUrl()        != null) job.setImageUrl(req.getImageUrl());
        if (req.getStatus()          != null) job.setStatus(req.getStatus());
        if (req.getContactEmail()    != null) job.setContactEmail(req.getContactEmail());
        if (req.getExpiresAt()       != null) job.setExpiresAt(req.getExpiresAt());

        JobPosting saved = jobRepo.save(job);
        log.info("Job updated: id={}", saved.getId());
        return mapper.toDetail(saved);
    }

    public void delete(Integer id) {
        if (jobRepo.findActiveById(id).isEmpty()) {
            throw AppException.notFound("Job Posting không tồn tại: " + id);
        }
        jobRepo.softDelete(id, LocalDateTime.now());
        log.info("Job soft-deleted: id={}", id);
    }

    private void validateSalaryRange(BigDecimal salaryMin, BigDecimal salaryMax) {
        if (salaryMin != null && salaryMax != null) {
            if (salaryMin.compareTo(salaryMax) > 0) {
                throw AppException.badRequest("Lương tối thiểu không được lớn hơn lương tối đa");
            }
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
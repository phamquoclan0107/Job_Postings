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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
            Integer categoryId,
            JobStatus status,
            Pageable pageable) {

        Page<JobPosting> page = jobRepo.searchPage(
                isBlank(keyword)  ? null : keyword,
                isBlank(location) ? null : location,
                categoryId,
                status,
                pageable
        );

        List<Integer> ids = page.getContent().stream()
                .map(JobPosting::getId)
                .toList();

        List<JobPosting> fetched = ids.isEmpty()
                ? List.of()
                : jobRepo.findByIds(ids);

        Map<Integer, JobPosting> byId = fetched.stream()
                .collect(Collectors.toMap(JobPosting::getId, j -> j));

        List<JobPostingDTO.SummaryResponse> content = page.getContent().stream()
                .map(j -> mapper.toSummary(byId.getOrDefault(j.getId(), j)))
                .toList();

        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    public JobPostingDTO.DetailResponse create(JobPostingDTO.CreateRequest req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Admin admin = adminRepo.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("Admin không tồn tại"));

        Category category = categoryRepo.findById(req.getCategoryId())
                .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + req.getCategoryId()));

        if (!category.isJobCategory()) {
            throw AppException.badRequest("Danh mục phải thuộc loại JOB");
        }

        JobPosting job = JobPosting.builder()
                .admin(admin)
                .category(category)
                .title(req.getTitle())
                .description(req.getDescription())
                .jobType(req.getJobType())
                .experienceLevel(req.getExperienceLevel())
                .incomeLevel(req.getIncomeLevel())
                .benefits(req.getBenefits())
                .requirements(req.getRequirements())
                .location(req.getLocation())
                .status(req.getStatus())
                .contactEmail(req.getContactEmail())
                .expiresAt(req.getExpiresAt())
                .build();

        JobPosting saved = jobRepo.save(job);
        log.info("Job created: id={}, title={}, admin={}", saved.getId(), saved.getTitle(), username);
        return mapper.toDetail(saved);
    }

    public JobPostingDTO.DetailResponse update(Integer id, JobPostingDTO.UpdateRequest req) {
        JobPosting job = jobRepo.findActiveById(id)
                .orElseThrow(() -> AppException.notFound("Job Posting không tồn tại: " + id));

        if (req.getCategoryId() != null) {
            Category cat = categoryRepo.findById(req.getCategoryId())
                    .orElseThrow(() -> AppException.notFound("Danh mục không tồn tại: " + req.getCategoryId()));
            if (!cat.isJobCategory()) {
                throw AppException.badRequest("Danh mục phải thuộc loại JOB");
            }
            job.setCategory(cat);
        }
        if (req.getTitle()           != null) job.setTitle(req.getTitle());
        if (req.getDescription()     != null) job.setDescription(req.getDescription());
        if (req.getJobType()         != null) job.setJobType(req.getJobType());
        if (req.getExperienceLevel() != null) job.setExperienceLevel(req.getExperienceLevel());
        if (req.getIncomeLevel()     != null) job.setIncomeLevel(req.getIncomeLevel());
        if (req.getBenefits()        != null) job.setBenefits(req.getBenefits());
        if (req.getRequirements()    != null) job.setRequirements(req.getRequirements());
        if (req.getLocation()        != null) job.setLocation(req.getLocation());
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

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}
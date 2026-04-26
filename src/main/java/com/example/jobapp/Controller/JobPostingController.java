package com.example.jobapp.Controller;

import com.example.jobapp.common.ApiResponse;
import com.example.jobapp.DTOs.JobPostingDTO;
import com.example.jobapp.Entity.JobPosting.JobStatus;
import com.example.jobapp.service.JobPostingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobPostingDTO.SummaryResponse>>> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal salaryMin,
            @RequestParam(required = false) BigDecimal salaryMax,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParts = sort.split(",");
        Sort.Direction dir = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));

        Page<JobPostingDTO.SummaryResponse> result = jobService.search(
                keyword, location, salaryMin, salaryMax, categoryId, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<JobPostingDTO.SummaryResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal salaryMin,
            @RequestParam(required = false) BigDecimal salaryMax,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParts = sort.split(",");
        Sort.Direction dir = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));

        String kw = keyword != null ? keyword : title;
        Page<JobPostingDTO.SummaryResponse> result = jobService.search(
                kw, location, salaryMin, salaryMax, categoryId, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPostingDTO.DetailResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getById(id)));
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<ApiResponse<List<JobPostingDTO.SummaryResponse>>> getSimilar(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "4") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getSimilar(id, limit)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobPostingDTO.DetailResponse>> create(
            @Valid @RequestBody JobPostingDTO.CreateRequest req) {
        JobPostingDTO.DetailResponse resp = jobService.create(req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo tin tuyển dụng thành công", resp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPostingDTO.DetailResponse>> update(
            @PathVariable Integer id,
            @Valid @RequestBody JobPostingDTO.UpdateRequest req) {
        return ResponseEntity.ok(
                ApiResponse.ok("Cập nhật tin tuyển dụng thành công", jobService.update(id, req))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        jobService.delete(id);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa tin tuyển dụng thành công"));
    }
}
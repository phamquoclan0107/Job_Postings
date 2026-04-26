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

import java.util.List;

/**
 * GET    /api/jobs                   — danh sách đơn giản (không phân trang)
 * GET    /api/jobs/search            — tìm kiếm + phân trang + filter
 * GET    /api/jobs/{id}              — chi tiết
 * POST   /api/jobs                   — tạo mới (cần JWT)
 * PUT    /api/jobs/{id}              — cập nhật (cần JWT)
 * DELETE /api/jobs/{id}              — soft delete (cần JWT)
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobService;

    /**
     * Lấy tất cả job (không phân trang) — dùng cho landing page, widget nhỏ.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<JobPostingDTO.SummaryResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getAll()));
    }

    /**
     * Tìm kiếm + Phân trang + Filter.
     * Query params:
     *   title      — tìm theo tiêu đề (LIKE, không phân biệt hoa thường)
     *   categoryId — lọc theo danh mục
     *   status     — lọc theo trạng thái: ACTIVE | CLOSED
     *   page       — trang (default 0)
     *   size       — số bản ghi/trang (default 10)
     *   sort       — ví dụ: createdAt,desc
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<JobPostingDTO.SummaryResponse>>> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        String[] sortParts  = sort.split(",");
        Sort.Direction dir  = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable   = PageRequest.of(page, size, Sort.by(dir, sortParts[0]));

        Page<JobPostingDTO.SummaryResponse> result = jobService.search(title, categoryId, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobPostingDTO.DetailResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getById(id)));
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
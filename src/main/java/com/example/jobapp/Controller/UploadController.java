package com.example.jobapp.Controller;

import com.example.jobapp.common.ApiResponse;
import com.example.jobapp.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Upload ảnh job posting lên VPS.
 *
 * POST   /api/upload/jobs         — upload 1 ảnh job
 * POST   /api/upload/jobs/multiple — upload nhiều ảnh job
 *
 * Lưu tại: /var/www/uploads/jobs/
 * Trả về URL public.
 *
 * Note: Product images được upload qua /api/products/{id}/images
 */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/jobs")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadJobImage(
            @RequestParam("file") MultipartFile file) {

        String url = fileStorageService.saveJobImage(file);
        return ResponseEntity.ok(ApiResponse.ok("Upload thành công", Map.of("url", url)));
    }

    @PostMapping("/jobs/multiple")
    public ResponseEntity<ApiResponse<Map<String, List<String>>>> uploadMultipleJobImages(
            @RequestParam("files") List<MultipartFile> files) {

        List<String> urls = files.stream()
                .filter(f -> !f.isEmpty())
                .map(fileStorageService::saveJobImage)
                .toList();

        return ResponseEntity.ok(ApiResponse.ok("Upload thành công", Map.of("urls", urls)));
    }
}
package com.example.jobapp.service;

import com.example.jobapp.exception.AppException;
import com.example.jobapp.utils.FileUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

/**
 * Lưu file lên VPS local.
 * - Job images  → /var/www/uploads/jobs/
 * - Product images → /var/www/uploads/products/
 * Trả về public URL để FE hiển thị.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${upload.jobs-dir}")
    private String jobsDir;

    @Value("${upload.products-dir}")
    private String productsDir;

    @Value("${upload.base-url}")
    private String baseUrl;

    private final FileUtils fileUtils;

    // ─── Job image ─────────────────────────────────────────────────────────────

    /**
     * Upload ảnh cho job posting.
     * Tên file: uuid + extension
     * Lưu tại: /var/www/uploads/jobs/{uuid}.ext
     */
    public String saveJobImage(MultipartFile file) {
        fileUtils.validateImageFile(file);

        String ext      = fileUtils.getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + ext;

        saveToDisk(file, jobsDir, filename);
        String url = baseUrl + "/jobs/" + filename;
        log.info("Saved job image: {}", url);
        return url;
    }

    /**
     * Xóa ảnh job theo URL.
     */
    public void deleteJobImage(String imageUrl) {
        deleteFromDisk(jobsDir, extractFilename(imageUrl));
    }

    // ─── Product image ─────────────────────────────────────────────────────────

    /**
     * Upload ảnh cho product.
     * Tên file: productCode_originalName (theo yêu cầu)
     * Lưu tại: /var/www/uploads/products/PROD001_banner.jpg
     */
    public String saveProductImage(MultipartFile file, String productCode) {
        fileUtils.validateImageFile(file);

        String filename = fileUtils.buildProductFileName(
                productCode,
                file.getOriginalFilename()
        );

        // Nếu trùng tên → thêm UUID prefix tránh ghi đè
        if (Files.exists(Paths.get(productsDir, filename))) {
            filename = UUID.randomUUID().toString().substring(0, 8) + "_" + filename;
        }

        saveToDisk(file, productsDir, filename);
        String url = baseUrl + "/products/" + filename;
        log.info("Saved product image: {}", url);
        return url;
    }

    /**
     * Xóa ảnh product theo URL.
     */
    public void deleteProductImage(String imageUrl) {
        deleteFromDisk(productsDir, extractFilename(imageUrl));
    }

    // ─── Private helpers ───────────────────────────────────────────────────────

    private void saveToDisk(MultipartFile file, String dir, String filename) {
        try {
            Path dirPath = Paths.get(dir);
            Files.createDirectories(dirPath);

            Path dest = dirPath.resolve(filename).normalize();

            // Ngăn path traversal
            if (!dest.startsWith(dirPath)) {
                throw AppException.badRequest("Tên file không hợp lệ");
            }

            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("Cannot save file '{}' to '{}'", filename, dir, e);
            throw AppException.badRequest("Không thể lưu file: " + e.getMessage());
        }
    }

    private void deleteFromDisk(String dir, String filename) {
        try {
            Path target = Paths.get(dir, filename).normalize();
            if (!target.startsWith(Paths.get(dir))) {
                throw AppException.badRequest("Tên file không hợp lệ");
            }
            boolean deleted = Files.deleteIfExists(target);
            if (deleted) {
                log.info("Deleted file: {}", target);
            } else {
                log.warn("File not found for deletion: {}", target);
            }
        } catch (IOException e) {
            log.error("Cannot delete file '{}' from '{}'", filename, dir, e);
        }
    }

    /** Public — dùng bởi ProductService để lấy tên file từ URL. */
    public String extractPublicFilename(String url) {
        if (url == null || url.isBlank()) return "";
        return url.substring(url.lastIndexOf("/") + 1);
    }

    private String extractFilename(String url) {
        return extractPublicFilename(url);
    }
}
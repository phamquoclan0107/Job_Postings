package com.example.jobapp.utils;

import com.example.jobapp.exception.AppException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public class FileUtils {

    private static final List<String> ALLOWED_IMAGE_EXTENSIONS =
            List.of(".jpg", ".jpeg", ".png", ".gif", ".webp");

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024L; // 10 MB

    /**
     * Lấy extension của file (bao gồm dấu chấm, lowercase).
     * Ví dụ: "photo.JPG" → ".jpg"
     */
    public String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf(".")).toLowerCase();
    }

    /**
     * Tạo tên file cho product image.
     * Format: productCode_originalName
     * Ví dụ: PROD001_banner.jpg
     */
    public String buildProductFileName(String productCode, String originalFilename) {
        String safeName = sanitizeFilename(originalFilename);
        return productCode + "_" + safeName;
    }

    /**
     * Xóa ký tự đặc biệt khỏi tên file để tránh path traversal.
     */
    public String sanitizeFilename(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    /**
     * Validate file ảnh: extension + size.
     * Throws AppException nếu không hợp lệ.
     */
    public void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw AppException.badRequest("File không được để trống");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw AppException.badRequest("File quá lớn. Tối đa 10MB");
        }

        String ext = getExtension(file.getOriginalFilename());
        if (!ALLOWED_IMAGE_EXTENSIONS.contains(ext)) {
            throw AppException.badRequest(
                    "Chỉ chấp nhận file ảnh: " + String.join(", ", ALLOWED_IMAGE_EXTENSIONS)
            );
        }
    }
}
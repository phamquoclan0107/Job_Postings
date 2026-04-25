package com.example.jobapp.service;

import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Service xử lý upload file lên MinIO Local.
 *
 * Luồng hoạt động:
 *   1. FE gọi POST /api/v1/upload với multipart/form-data
 *   2. Service tạo tên file unique (UUID + extension gốc)
 *   3. Upload lên bucket đã cấu hình
 *   4. Trả về public URL dạng: http://localhost:9000/{bucket}/{objectName}
 *
 * Điều kiện: bucket phải được set policy = public-read trước.
 * Cách set qua MinIO Console hoặc mc CLI:
 *   mc alias set local http://localhost:9000 minioadmin minioadmin
 *   mc mb local/job-uploads
 *   mc anonymous set public local/job-uploads
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.endpoint}")
    private String endpoint;

    /**
     * Upload file, trả về URL công khai.
     * URL format: http://localhost:9000/{bucket}/{uuid-filename}
     */
    public String uploadFile(MultipartFile file) {
        try {
            // Đảm bảo bucket tồn tại
            ensureBucketExists();

            // Tạo tên file unique để tránh trùng lặp
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String objectName = UUID.randomUUID() + extension;

            // Upload lên MinIO
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            // Trả về URL công khai
            // Bucket phải có policy public-read để URL này hoạt động không cần sign
            String publicUrl = endpoint + "/" + bucketName + "/" + objectName;
            log.info("Uploaded file to MinIO: {}", publicUrl);
            return publicUrl;

        } catch (Exception e) {
            log.error("Error uploading file to MinIO", e);
            throw new RuntimeException("Không thể upload file: " + e.getMessage(), e);
        }
    }

    /**
     * Xóa file khỏi MinIO theo URL hoặc objectName.
     */
    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .build()
            );
            log.info("Deleted file from MinIO: {}", objectName);
        } catch (Exception e) {
            log.error("Error deleting file from MinIO: {}", objectName, e);
            throw new RuntimeException("Không thể xóa file: " + e.getMessage(), e);
        }
    }

    /**
     * Lấy presigned URL (tạm thời, có thời hạn) cho file private.
     * Dùng khi bucket không public nhưng cần cho người dùng tải xuống.
     */
    public String getPresignedUrl(String objectName, int expiryMinutes) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectName)
                            .expiry(expiryMinutes, TimeUnit.MINUTES)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error generating presigned URL for: {}", objectName, e);
            throw new RuntimeException("Không thể tạo presigned URL: " + e.getMessage(), e);
        }
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private void ensureBucketExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder().bucket(bucketName).build()
        );
        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            log.info("Created MinIO bucket: {}", bucketName);
        }
    }
}
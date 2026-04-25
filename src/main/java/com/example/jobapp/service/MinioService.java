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
 * Service upload/delete file lên MinIO.
 *
 * Luồng:
 *   FE → POST /api/upload → MinioService.uploadFile()
 *     → lưu lên bucket
 *     → trả về public URL: {app.minio.public-url}/{objectName}
 *
 * app.minio.public-url có thể trỏ ra domain/IP public nếu deploy VPS.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${app.minio.bucket}")
    private String bucket;

    @Value("${app.minio.url}")
    private String minioUrl;

    @Value("${app.minio.public-url}")
    private String publicUrl;

    // ─── Upload ──────────────────────────────────────────────────────────────

    /**
     * Upload file lên MinIO, trả về public URL.
     * URL: {app.minio.public-url}/{uuid}.ext
     */
    public String uploadFile(MultipartFile file) {
        try {
            ensureBucketExists();

            String ext        = getExtension(file.getOriginalFilename());
            String objectName = UUID.randomUUID() + ext;

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            String url = publicUrl + "/" + objectName;
            log.info("Uploaded to MinIO: {}", url);
            return url;

        } catch (Exception e) {
            log.error("Error uploading to MinIO", e);
            throw new RuntimeException("Không thể upload file: " + e.getMessage(), e);
        }
    }

    // ─── Delete ──────────────────────────────────────────────────────────────

    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build()
            );
            log.info("Deleted from MinIO: {}", objectName);
        } catch (Exception e) {
            log.error("Error deleting from MinIO: {}", objectName, e);
            throw new RuntimeException("Không thể xóa file: " + e.getMessage(), e);
        }
    }

    // ─── Presigned URL ───────────────────────────────────────────────────────

    public String getPresignedUrl(String objectName, int expiryMinutes) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucket)
                            .object(objectName)
                            .expiry(expiryMinutes, TimeUnit.MINUTES)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error generating presigned URL for: {}", objectName, e);
            throw new RuntimeException("Không thể tạo presigned URL: " + e.getMessage(), e);
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private void ensureBucketExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder().bucket(bucket).build()
        );
        if (!exists) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            log.info("Created MinIO bucket: {}", bucket);
        }
    }

    private String getExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }
}

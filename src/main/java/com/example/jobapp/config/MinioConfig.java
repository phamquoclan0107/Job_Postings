package com.example.jobapp.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Cấu hình MinIO client.
 * Tất cả giá trị đọc từ app.minio.* trong application.properties
 * → được inject từ biến môi trường MINIO_* qua docker-compose.
 */
@Configuration
public class MinioConfig {

    @Value("${app.minio.url}")
    private String url;

    @Value("${app.minio.access-key}")
    private String accessKey;

    @Value("${app.minio.secret-key}")
    private String secretKey;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(url)
                .credentials(accessKey, secretKey)
                .build();
    }
}

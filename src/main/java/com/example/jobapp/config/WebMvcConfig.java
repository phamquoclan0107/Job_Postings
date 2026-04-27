package com.example.jobapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Phục vụ ảnh upload tĩnh qua HTTP.
 * Ảnh upload vào ${upload.base-dir} sẽ có thể truy cập qua /uploads/**
 *
 * Ví dụ: ~/uploads/jobs/abc.jpg → http://localhost:8080/uploads/jobs/abc.jpg
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${upload.base-dir}")
    private String uploadBaseDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Normalize path để đảm bảo kết thúc bằng /
        String location = uploadBaseDir.endsWith("/")
                ? "file:" + uploadBaseDir
                : "file:" + uploadBaseDir + "/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}

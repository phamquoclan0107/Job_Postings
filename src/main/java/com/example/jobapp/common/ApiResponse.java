package com.example.jobapp.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Map<String, String> errors;
    private LocalDateTime timestamp;

    private ApiResponse(boolean success, String message, T data) {
        this.success   = success;
        this.message   = message;
        this.data      = data;
        this.timestamp = LocalDateTime.now();
    }

    private ApiResponse(boolean success, String message, Map<String, String> errors) {
        this.success   = success;
        this.message   = message;
        this.errors    = errors;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, "Thành công", data);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> created(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static ApiResponse<Void> noContent(String message) {
        return new ApiResponse<>(true, message, (Void) null);
    }

    public static ApiResponse<Void> error(String message) {
        return new ApiResponse<>(false, message, (Void) null);
    }

    public static ApiResponse<Void> validationError(String message, Map<String, String> errors) {
        return new ApiResponse<>(false, message, errors);
    }
}
package com.example.jobapp.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception dùng chung cho toàn bộ app
 */
public class AppException extends RuntimeException {

    private final HttpStatus status;

    public AppException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    /* ================== Factory methods ================== */

    public static AppException notFound(String message) {
        return new AppException(message, HttpStatus.NOT_FOUND);
    }

    public static AppException badRequest(String message) {
        return new AppException(message, HttpStatus.BAD_REQUEST);
    }

    public static AppException unauthorized(String message) {
        return new AppException(message, HttpStatus.UNAUTHORIZED);
    }

    public static AppException forbidden(String message) {
        return new AppException(message, HttpStatus.FORBIDDEN);
    }

    public static AppException internal(String message) {
        return new AppException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    public static AppException conflict(String message) {
        return new AppException(message, HttpStatus.CONFLICT);
    }
}
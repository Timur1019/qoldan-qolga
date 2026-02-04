package com.test.qoldanqolga.util;

import com.test.qoldanqolga.dto.common.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

/**
 * Помощник для единообразных ответов об ошибках по всему проекту.
 */
public final class ApiErrorResponseHelper {

    private ApiErrorResponseHelper() {
    }

    public static ResponseEntity<ApiErrorResponse> badRequest(String message) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of(message));
    }

    public static ResponseEntity<ApiErrorResponse> badRequest(String message, Map<String, String> errors) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of(message, errors));
    }

    public static ResponseEntity<ApiErrorResponse> status(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(ApiErrorResponse.of(message));
    }
}

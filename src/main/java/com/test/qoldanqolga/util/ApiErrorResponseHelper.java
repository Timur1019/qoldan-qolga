package com.test.qoldanqolga.util;

import com.test.qoldanqolga.dto.common.ApiErrorResponse;
import com.test.qoldanqolga.exception.ErrorCode;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public final class ApiErrorResponseHelper {

    private ApiErrorResponseHelper() {
    }

    public static ResponseEntity<ApiErrorResponse> from(ErrorCode code) {
        return from(code, code.getDefaultMessage(), null);
    }

    public static ResponseEntity<ApiErrorResponse> from(ErrorCode code, String message) {
        return from(code, message, null);
    }

    public static ResponseEntity<ApiErrorResponse> from(ErrorCode code, String message, Map<String, String> errors) {
        int status = code.getHttpStatus().value();
        String text = message != null && !message.isBlank() ? message : code.getDefaultMessage();
        return ResponseEntity
                .status(code.getHttpStatus())
                .body(ApiErrorResponse.of(code.name(), status, text, errors));
    }

    public static ResponseEntity<ApiErrorResponse> badRequest(String message) {
        return from(ErrorCode.BAD_REQUEST, message);
    }

    public static ResponseEntity<ApiErrorResponse> badRequest(String message, Map<String, String> errors) {
        return from(ErrorCode.VALIDATION_ERROR, message, errors);
    }
}

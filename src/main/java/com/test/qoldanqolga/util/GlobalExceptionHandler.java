package com.test.qoldanqolga.util;

import com.test.qoldanqolga.dto.common.ApiErrorResponse;
import com.test.qoldanqolga.exception.BaseException;
import com.test.qoldanqolga.exception.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiErrorResponse> handleBase(BaseException e) {
        ErrorCode code = e.getCode() != null ? e.getCode() : ErrorCode.INTERNAL_ERROR;
        if (code.getHttpStatus().is5xxServerError()) {
            LogUtil.error(GlobalExceptionHandler.class, "Business/system error [{}]: {}", code.name(), e.getMessage());
        } else {
            LogUtil.warn(GlobalExceptionHandler.class, "API error [{}]: {}", code.name(), e.getMessage());
        }
        return ApiErrorResponseHelper.from(code, e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(IllegalArgumentException e) {
        LogUtil.warn(GlobalExceptionHandler.class, "Bad request: {}", e.getMessage());
        return ApiErrorResponseHelper.from(ErrorCode.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        LogUtil.debug(GlobalExceptionHandler.class, "Validation failed: {} fields", e.getBindingResult().getFieldErrorCount());
        Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "",
                        (a, b) -> b
                ));
        return ApiErrorResponseHelper.from(ErrorCode.VALIDATION_ERROR, ErrorCode.VALIDATION_ERROR.getDefaultMessage(), errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception e) {
        LogUtil.error(GlobalExceptionHandler.class, "Unexpected error", e);
        return ApiErrorResponseHelper.from(ErrorCode.INTERNAL_ERROR);
    }
}

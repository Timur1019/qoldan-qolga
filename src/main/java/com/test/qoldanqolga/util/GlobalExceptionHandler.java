package com.test.qoldanqolga.util;

import com.test.qoldanqolga.dto.common.ApiErrorResponse;
import com.test.qoldanqolga.exception.AdAccessDeniedException;
import com.test.qoldanqolga.exception.ChatAccessDeniedException;
import com.test.qoldanqolga.exception.SelfConversationException;
import com.test.qoldanqolga.exception.SelfSubscriptionException;
import com.test.qoldanqolga.exception.SelfReviewException;
import com.test.qoldanqolga.exception.ConflictException;
import com.test.qoldanqolga.exception.InvalidCredentialsException;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.exception.AdvertisementNotActiveException;
import com.test.qoldanqolga.exception.FileTooLargeException;
import com.test.qoldanqolga.exception.InvalidImageException;
import com.test.qoldanqolga.exception.UnsupportedImageFormatException;
import com.test.qoldanqolga.exception.UnsupportedPromoServiceException;
import com.test.qoldanqolga.exception.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * Единая точка обработки исключений приложения.
 * Преобразует доменные исключения в HTTP-ответы без жёсткой связи контроллеров с деталями ошибок.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException e) {
        LogUtil.debug(GlobalExceptionHandler.class, "Resource not found: {}", e.getMessage());
        return ApiErrorResponseHelper.status(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(ConflictException e) {
        LogUtil.warn(GlobalExceptionHandler.class, "Conflict: {}", e.getMessage());
        return ApiErrorResponseHelper.status(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(InvalidCredentialsException e) {
        LogUtil.warn(GlobalExceptionHandler.class, "Invalid credentials: {}", e.getMessage());
        return ApiErrorResponseHelper.status(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(AdAccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAdAccessDenied(AdAccessDeniedException e) {
        LogUtil.warn(GlobalExceptionHandler.class, "Ad access denied: {}", e.getMessage());
        return ApiErrorResponseHelper.status(HttpStatus.FORBIDDEN, e.getMessage());
    }

    @ExceptionHandler(ChatAccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleChatAccessDenied(ChatAccessDeniedException e) {
        LogUtil.warn(GlobalExceptionHandler.class, "Chat access denied: {}", e.getMessage());
        return ApiErrorResponseHelper.status(HttpStatus.FORBIDDEN, e.getMessage());
    }

    @ExceptionHandler(AdvertisementNotActiveException.class)
    public ResponseEntity<ApiErrorResponse> handleAdvertisementNotActive(AdvertisementNotActiveException e) {
        LogUtil.debug(GlobalExceptionHandler.class, "Ad not active: {}", e.getMessage());
        return ApiErrorResponseHelper.badRequest(e.getMessage());
    }

    @ExceptionHandler(UnsupportedPromoServiceException.class)
    public ResponseEntity<ApiErrorResponse> handleUnsupportedPromoService(UnsupportedPromoServiceException e) {
        LogUtil.warn(GlobalExceptionHandler.class, "Unsupported promo service: {}", e.getMessage());
        return ApiErrorResponseHelper.badRequest(e.getMessage());
    }

    @ExceptionHandler(SelfSubscriptionException.class)
    public ResponseEntity<ApiErrorResponse> handleSelfSubscription(SelfSubscriptionException e) {
        LogUtil.debug(GlobalExceptionHandler.class, "Self subscription: {}", e.getMessage());
        return ApiErrorResponseHelper.badRequest(e.getMessage());
    }

    @ExceptionHandler(SelfReviewException.class)
    public ResponseEntity<ApiErrorResponse> handleSelfReview(SelfReviewException e) {
        LogUtil.debug(GlobalExceptionHandler.class, "Self review: {}", e.getMessage());
        return ApiErrorResponseHelper.badRequest(e.getMessage());
    }

    @ExceptionHandler(SelfConversationException.class)
    public ResponseEntity<ApiErrorResponse> handleSelfConversation(SelfConversationException e) {
        LogUtil.debug(GlobalExceptionHandler.class, "Self conversation: {}", e.getMessage());
        return ApiErrorResponseHelper.badRequest(e.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(ValidationException e) {
        LogUtil.debug(GlobalExceptionHandler.class, "Validation: {}", e.getMessage());
        return ApiErrorResponseHelper.badRequest(e.getMessage());
    }

    @ExceptionHandler({FileTooLargeException.class, InvalidImageException.class, UnsupportedImageFormatException.class})
    public ResponseEntity<ApiErrorResponse> handleImageValidation(RuntimeException e) {
        LogUtil.warn(GlobalExceptionHandler.class, "Image validation failed: {}", e.getMessage());
        return ApiErrorResponseHelper.badRequest(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(IllegalArgumentException e) {
        LogUtil.warn(GlobalExceptionHandler.class, "Bad request: {}", e.getMessage());
        return ApiErrorResponseHelper.badRequest(e.getMessage() != null ? e.getMessage() : "Ошибка запроса");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        LogUtil.debug(GlobalExceptionHandler.class, "Validation failed: {} fields", e.getBindingResult().getFieldErrorCount());
        Map<String, String> errors = e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "", (a, b) -> b));
        return ApiErrorResponseHelper.badRequest("Ошибка валидации", errors);
    }
}

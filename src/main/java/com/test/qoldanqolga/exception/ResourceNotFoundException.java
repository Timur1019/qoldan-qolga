package com.test.qoldanqolga.exception;

/**
 * Thrown when a requested resource does not exist.
 * Mapped to HTTP 404 by {@link com.test.qoldanqolga.util.GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(String.format("%s не найдено: %s", resourceName, identifier));
    }
}

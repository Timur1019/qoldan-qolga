package com.test.qoldanqolga.exception;

/**
 * Thrown when an operation conflicts with current state (e.g. duplicate resource).
 * Mapped to HTTP 409 by {@link com.test.qoldanqolga.util.GlobalExceptionHandler}.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}

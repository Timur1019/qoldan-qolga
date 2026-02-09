package com.test.qoldanqolga.exception;

/**
 * Thrown when authentication fails (wrong password, disabled account, etc.).
 * Mapped to HTTP 401 by {@link com.test.qoldanqolga.util.GlobalExceptionHandler}.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message) {
        super(message);
    }
}

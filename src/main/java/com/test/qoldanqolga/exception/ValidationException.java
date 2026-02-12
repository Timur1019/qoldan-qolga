package com.test.qoldanqolga.exception;

import java.util.List;

/**
 * Исключение при ошибках бизнес-валидации (не Jakarta Bean Validation).
 * Mapped to HTTP 400 by {@link com.test.qoldanqolga.util.GlobalExceptionHandler}.
 */
public class ValidationException extends RuntimeException {

    private final List<String> errors;

    public ValidationException(List<String> errors) {
        super(errors != null && !errors.isEmpty() ? String.join("; ", errors) : "Ошибка валидации");
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}

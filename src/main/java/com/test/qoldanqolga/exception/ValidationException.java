package com.test.qoldanqolga.exception;

import java.util.List;

public class ValidationException extends BaseException {

    private final List<String> errors;

    public ValidationException(List<String> errors) {
        super(
                ErrorCode.VALIDATION_ERROR,
                errors != null && !errors.isEmpty() ? String.join("; ", errors) : ErrorCode.VALIDATION_ERROR.getDefaultMessage()
        );
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}

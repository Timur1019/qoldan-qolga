package com.test.qoldanqolga.exception;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {

    private final ErrorCode code;

    protected BaseException(ErrorCode code) {
        super(code.getDefaultMessage());
        this.code = code;
    }

    protected BaseException(ErrorCode code, String message) {
        super(message != null && !message.isBlank() ? message : code.getDefaultMessage());
        this.code = code;
    }

    protected BaseException(ErrorCode code, String message, Throwable cause) {
        super(message != null && !message.isBlank() ? message : code.getDefaultMessage(), cause);
        this.code = code;
    }
}

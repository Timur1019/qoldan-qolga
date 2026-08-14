package com.test.qoldanqolga.exception;

public class ConflictException extends BaseException {

    public ConflictException(String message) {
        super(ErrorCode.CONFLICT, message);
    }

    public ConflictException(ErrorCode code) {
        super(code);
    }

    public ConflictException(ErrorCode code, String message) {
        super(code, message);
    }
}

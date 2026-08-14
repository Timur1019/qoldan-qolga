package com.test.qoldanqolga.exception;

public class InvalidCredentialsException extends BaseException {

    public InvalidCredentialsException(String message) {
        super(ErrorCode.INVALID_CREDENTIALS, message);
    }

    public InvalidCredentialsException(ErrorCode code) {
        super(code);
    }

    public InvalidCredentialsException(ErrorCode code, String message) {
        super(code, message);
    }
}

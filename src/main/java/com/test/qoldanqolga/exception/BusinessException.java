package com.test.qoldanqolga.exception;

public class BusinessException extends BaseException {

    public BusinessException(ErrorCode code) {
        super(code);
    }

    public BusinessException(ErrorCode code, String message) {
        super(code, message);
    }
}

package com.test.qoldanqolga.exception;

public class MyIdException extends BusinessException {

    public MyIdException(ErrorCode code) {
        super(code);
    }

    public MyIdException(ErrorCode code, String message) {
        super(code, message);
    }
}

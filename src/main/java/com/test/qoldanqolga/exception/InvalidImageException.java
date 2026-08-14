package com.test.qoldanqolga.exception;

public class InvalidImageException extends ImageStorageException {

    public InvalidImageException(String message) {
        super(ErrorCode.INVALID_IMAGE, message);
    }
}

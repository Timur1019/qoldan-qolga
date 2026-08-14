package com.test.qoldanqolga.exception;

public class ImageStorageException extends BaseException {

    public ImageStorageException(String message) {
        super(ErrorCode.IMAGE_STORAGE_ERROR, message);
    }

    public ImageStorageException(ErrorCode code, String message) {
        super(code, message);
    }

    public ImageStorageException(String message, Throwable cause) {
        super(ErrorCode.IMAGE_STORAGE_ERROR, message, cause);
    }
}

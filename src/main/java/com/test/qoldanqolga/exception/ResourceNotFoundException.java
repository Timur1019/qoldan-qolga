package com.test.qoldanqolga.exception;

public class ResourceNotFoundException extends BaseException {

    public ResourceNotFoundException(String message) {
        super(ErrorCode.NOT_FOUND, message);
    }

    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(ErrorCode.NOT_FOUND, String.format("%s не найдено: %s", resourceName, identifier));
    }
}

package com.test.qoldanqolga.exception;

/**
 * Базовое исключение для операций хранения изображений.
 */
public class ImageStorageException extends RuntimeException {

    public ImageStorageException(String message) {
        super(message);
    }

    public ImageStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}

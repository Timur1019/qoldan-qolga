package com.test.qoldanqolga.exception;

/**
 * Файл не является валидным изображением.
 */
public class InvalidImageException extends ImageStorageException {

    public InvalidImageException(String message) {
        super(message);
    }
}

package com.test.qoldanqolga.exception;

/**
 * Неподдерживаемый формат изображения.
 */
public class UnsupportedImageFormatException extends ImageStorageException {

    public UnsupportedImageFormatException(String format) {
        super("Неподдерживаемый формат изображения: " + format);
    }
}

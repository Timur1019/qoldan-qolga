package com.test.qoldanqolga.exception;

/**
 * Файл превышает допустимый размер.
 */
public class FileTooLargeException extends ImageStorageException {

    public FileTooLargeException(String message) {
        super(message);
    }
}

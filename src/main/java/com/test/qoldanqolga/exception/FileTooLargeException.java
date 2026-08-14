package com.test.qoldanqolga.exception;

public class FileTooLargeException extends ImageStorageException {

    public FileTooLargeException(String message) {
        super(ErrorCode.FILE_TOO_LARGE, message);
    }
}

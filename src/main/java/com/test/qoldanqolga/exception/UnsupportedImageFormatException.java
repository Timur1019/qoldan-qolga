package com.test.qoldanqolga.exception;

public class UnsupportedImageFormatException extends ImageStorageException {

    public UnsupportedImageFormatException(String format) {
        super(ErrorCode.UNSUPPORTED_IMAGE_FORMAT, "Неподдерживаемый формат изображения: " + format);
    }
}

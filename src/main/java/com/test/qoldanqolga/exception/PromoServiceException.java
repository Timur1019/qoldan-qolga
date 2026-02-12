package com.test.qoldanqolga.exception;

/**
 * Базовое исключение для промо-услуг.
 */
public class PromoServiceException extends RuntimeException {

    public PromoServiceException(String message) {
        super(message);
    }
}

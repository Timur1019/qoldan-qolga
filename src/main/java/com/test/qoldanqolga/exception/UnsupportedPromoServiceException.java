package com.test.qoldanqolga.exception;

/**
 * Услуга не поддерживается.
 */
public class UnsupportedPromoServiceException extends PromoServiceException {

    public UnsupportedPromoServiceException(String code) {
        super("Услуга не поддерживается: " + code);
    }
}

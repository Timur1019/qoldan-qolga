package com.test.qoldanqolga.exception;

public class UnsupportedPromoServiceException extends PromoServiceException {

    public UnsupportedPromoServiceException(String code) {
        super(ErrorCode.UNSUPPORTED_PROMO, "Услуга не поддерживается: " + code);
    }
}

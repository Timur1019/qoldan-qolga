package com.test.qoldanqolga.exception;

public class PromoServiceException extends BaseException {

    public PromoServiceException(String message) {
        super(ErrorCode.UNSUPPORTED_PROMO, message);
    }

    public PromoServiceException(ErrorCode code, String message) {
        super(code, message);
    }
}

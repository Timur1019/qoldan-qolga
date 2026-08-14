package com.test.qoldanqolga.exception;

public class AdvertisementNotActiveException extends PromoServiceException {

    public AdvertisementNotActiveException(String adId) {
        super(ErrorCode.AD_NOT_ACTIVE, "Объявление " + adId + " не активно");
    }
}

package com.test.qoldanqolga.exception;

/**
 * Объявление не активно (архив, удалено и т.п.).
 */
public class AdvertisementNotActiveException extends PromoServiceException {

    public AdvertisementNotActiveException(String adId) {
        super("Объявление " + adId + " не активно");
    }
}

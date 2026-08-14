package com.test.qoldanqolga.exception;

public class AdAccessDeniedException extends BaseException {

    public AdAccessDeniedException(String adId, String userId) {
        super(ErrorCode.AD_ACCESS_DENIED, String.format("Нет доступа к объявлению %s для пользователя %s", adId, userId));
    }
}

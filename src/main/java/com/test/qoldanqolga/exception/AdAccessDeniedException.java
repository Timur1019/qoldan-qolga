package com.test.qoldanqolga.exception;

/**
 * Доступ к объявлению запрещён (пользователь не владелец).
 * Mapped to HTTP 403 by {@link com.test.qoldanqolga.util.GlobalExceptionHandler}.
 */
public class AdAccessDeniedException extends RuntimeException {

    public AdAccessDeniedException(String adId, String userId) {
        super(String.format("Нет доступа к объявлению %s для пользователя %s", adId, userId));
    }
}

package com.test.qoldanqolga.exception;

/**
 * Нельзя создать чат со своим объявлением.
 * Mapped to HTTP 400 by {@link com.test.qoldanqolga.util.GlobalExceptionHandler}.
 */
public class SelfConversationException extends RuntimeException {

    public SelfConversationException(String adId) {
        super(String.format("Нельзя создать чат со своим объявлением (ad=%s)", adId));
    }
}

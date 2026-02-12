package com.test.qoldanqolga.exception;

/**
 * Пользователь пытается подписаться на самого себя.
 */
public class SelfSubscriptionException extends RuntimeException {

    public SelfSubscriptionException(String userId) {
        super("Нельзя подписаться на самого себя");
    }
}

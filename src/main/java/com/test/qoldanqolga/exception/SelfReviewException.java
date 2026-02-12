package com.test.qoldanqolga.exception;

/**
 * Пользователь пытается оставить отзыв самому себе.
 */
public class SelfReviewException extends RuntimeException {

    public SelfReviewException(String userId) {
        super("Нельзя оставить отзыв самому себе");
    }
}

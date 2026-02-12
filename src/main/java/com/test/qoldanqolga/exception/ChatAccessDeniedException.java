package com.test.qoldanqolga.exception;

/**
 * Доступ к чату запрещён.
 * Mapped to HTTP 403 by {@link com.test.qoldanqolga.util.GlobalExceptionHandler}.
 */
public class ChatAccessDeniedException extends RuntimeException {

    public ChatAccessDeniedException(String conversationId, String userId) {
        super(String.format("Пользователь %s не имеет доступа к диалогу %s", userId, conversationId));
    }
}

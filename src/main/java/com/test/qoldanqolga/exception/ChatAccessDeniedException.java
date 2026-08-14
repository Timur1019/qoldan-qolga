package com.test.qoldanqolga.exception;

public class ChatAccessDeniedException extends BaseException {

    public ChatAccessDeniedException(String conversationId, String userId) {
        super(ErrorCode.CHAT_ACCESS_DENIED, String.format("Пользователь %s не имеет доступа к диалогу %s", userId, conversationId));
    }
}

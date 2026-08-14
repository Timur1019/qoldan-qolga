package com.test.qoldanqolga.exception;

public class SelfConversationException extends BaseException {

    public SelfConversationException(String adId) {
        super(ErrorCode.SELF_CONVERSATION, String.format("Нельзя создать чат со своим объявлением (ad=%s)", adId));
    }
}

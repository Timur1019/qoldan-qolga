package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.config.SystemConversationProperties;
import com.test.qoldanqolga.exception.ChatAccessDeniedException;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Проверка доступа к чатам.
 */
@Component
@RequiredArgsConstructor
public class ChatAccessService {

    private final SystemConversationProperties systemConversationProperties;

    public void ensureParticipant(Conversation c, String userId) {
        boolean isBuyer = c.getBuyerId().equals(userId);
        boolean isSeller = c.getAd() != null && c.getAd().getUserId().equals(userId);
        if (!isSeller && c.getAdId() != null && c.getAdId().equals(systemConversationProperties.getAdId())
                && userId != null && userId.equals(systemConversationProperties.getUserId())) {
            isSeller = true;
        }
        if (!isBuyer && !isSeller) {
            LogUtil.warn(ChatAccessService.class, "Chat access denied: conversationId={} userId={}", c.getId(), userId);
            throw new ChatAccessDeniedException(c.getId(), userId);
        }
    }
}

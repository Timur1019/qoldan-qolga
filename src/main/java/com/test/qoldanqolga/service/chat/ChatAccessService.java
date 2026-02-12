package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.exception.ChatAccessDeniedException;
import com.test.qoldanqolga.model.Conversation;
import org.springframework.stereotype.Component;

/**
 * Проверка доступа к чатам.
 */
@Component
public class ChatAccessService {

    public void ensureParticipant(Conversation c, String userId) {
        boolean isBuyer = c.getBuyerId().equals(userId);
        boolean isSeller = c.getAd() != null && c.getAd().getUserId().equals(userId);
        if (!isBuyer && !isSeller) {
            throw new ChatAccessDeniedException(c.getId(), userId);
        }
    }
}

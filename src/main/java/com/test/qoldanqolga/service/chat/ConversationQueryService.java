package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;

import java.util.List;

/**
 * Чтение диалогов и сообщений.
 */
public interface ConversationQueryService {

    List<ConversationDto> getConversationsForUser(String userId);

    List<MessageDto> getMessages(String conversationId, String userId);
}

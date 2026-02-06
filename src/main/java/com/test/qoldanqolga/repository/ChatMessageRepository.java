package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    long countByConversationId(String conversationId);

    /** Количество сообщений от собеседника (не от currentUserId) — для бейджа «мне написали» */
    long countByConversationIdAndSenderIdNot(String conversationId, String senderId);
}

package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    long countByConversationId(String conversationId);

    long countByConversationIdAndSenderIdNot(String conversationId, String senderId);

    /** Непрочитанные от других после указанного времени (since не null). */
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.conversationId = :conversationId AND m.senderId != :userId AND m.createdAt > :since")
    long countUnreadSince(@Param("conversationId") String conversationId, @Param("userId") String userId, @Param("since") Instant since);
}

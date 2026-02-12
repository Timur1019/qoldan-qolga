package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {

    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    @Query("SELECT m FROM ChatMessage m LEFT JOIN FETCH m.sender WHERE m.conversationId = :conversationId ORDER BY m.createdAt ASC")
    List<ChatMessage> findByConversationIdWithSender(@Param("conversationId") String conversationId);

    long countByConversationId(String conversationId);

    long countByConversationIdAndSenderIdNot(String conversationId, String senderId);

    /** Непрочитанные от других после указанного времени (since не null). */
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.conversationId = :conversationId AND m.senderId != :userId AND m.createdAt > :since")
    long countUnreadSince(@Param("conversationId") String conversationId, @Param("userId") String userId, @Param("since") Instant since);

    /** Batch: [conversationId, count] для списка диалогов. */
    @Query("SELECT m.conversationId, COUNT(m) FROM ChatMessage m WHERE m.conversationId IN :conversationIds GROUP BY m.conversationId")
    List<Object[]> countByConversationIdIn(@Param("conversationIds") List<String> conversationIds);

    /** Batch: [conversationId, count] входящих (sender != excludeSenderId). */
    @Query("SELECT m.conversationId, COUNT(m) FROM ChatMessage m WHERE m.conversationId IN :conversationIds AND m.senderId <> :excludeSenderId GROUP BY m.conversationId")
    List<Object[]> countByConversationIdInAndSenderIdNot(@Param("conversationIds") List<String> conversationIds, @Param("excludeSenderId") String excludeSenderId);

    /** Batch: [conversationId, count] непрочитанных (где есть ConversationRead). */
    @Query("SELECT r.conversationId, COUNT(m) FROM ConversationRead r JOIN ChatMessage m ON m.conversationId = r.conversationId AND m.senderId <> :userId AND m.createdAt > r.lastReadAt WHERE r.userId = :userId AND r.conversationId IN :conversationIds GROUP BY r.conversationId")
    List<Object[]> countUnreadBatch(@Param("conversationIds") List<String> conversationIds, @Param("userId") String userId);

    @Modifying
    @Query("DELETE FROM ChatMessage m WHERE m.conversationId = :conversationId")
    void deleteAllByConversationId(@Param("conversationId") String conversationId);
}

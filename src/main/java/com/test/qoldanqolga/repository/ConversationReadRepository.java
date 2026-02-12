package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.ConversationRead;
import com.test.qoldanqolga.model.ConversationReadId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationReadRepository extends JpaRepository<ConversationRead, ConversationReadId> {

    Optional<ConversationRead> findByConversationIdAndUserId(String conversationId, String userId);

    List<ConversationRead> findByConversationId(String conversationId);

    List<ConversationRead> findByConversationIdInAndUserId(List<String> conversationIds, String userId);

    @Modifying
    @Query("DELETE FROM ConversationRead r WHERE r.conversationId = :conversationId")
    void deleteAllByConversationId(@Param("conversationId") String conversationId);
}

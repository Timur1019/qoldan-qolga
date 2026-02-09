package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.ConversationRead;
import com.test.qoldanqolga.model.ConversationReadId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationReadRepository extends JpaRepository<ConversationRead, ConversationReadId> {

    Optional<ConversationRead> findByConversationIdAndUserId(String conversationId, String userId);

    List<ConversationRead> findByConversationId(String conversationId);
}

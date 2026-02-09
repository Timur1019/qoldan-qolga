package com.test.qoldanqolga.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "conversation_read")
@IdClass(ConversationReadId.class)
@Getter
@Setter
public class ConversationRead {

    @Id
    @Column(name = "conversation_id", length = 36, nullable = false)
    private String conversationId;

    @Id
    @Column(name = "user_id", length = 36, nullable = false)
    private String userId;

    @Column(name = "last_read_at", nullable = false)
    private Instant lastReadAt;
}

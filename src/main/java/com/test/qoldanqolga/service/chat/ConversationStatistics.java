package com.test.qoldanqolga.service.chat;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ConversationStatistics {
    private long messageCount;
    private long incomingMessageCount;
    private long unreadCount;
    private Instant lastReadAt;
}

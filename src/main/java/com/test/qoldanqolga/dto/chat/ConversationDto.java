package com.test.qoldanqolga.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDto {

    private String id;
    private Long adId;
    private String adTitle;
    private String otherPartyName;  // продавец для покупателя, покупатель для продавца
    private String otherPartyId;
    private Instant createdAt;
    private long messageCount;
    /** Сообщений от собеседника (мне написали) — для бейджа в шапке и сайдбаре */
    private long incomingMessageCount;
}

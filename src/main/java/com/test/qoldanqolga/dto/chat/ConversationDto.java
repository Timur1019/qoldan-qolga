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
    private String adId;
    private String adTitle;
    private String adImageUrl;
    private java.math.BigDecimal adPrice;
    private String adCurrency;
    private String adRegion;
    private String otherPartyName;
    private String otherPartyId;
    private String otherPartyAvatar;
    private Instant otherPartyLastSeenAt;
    private Instant createdAt;
    private long messageCount;
    private long incomingMessageCount;
    private long unreadCount;
    private String lastMessageText;
    private Instant lastMessageAt;
}

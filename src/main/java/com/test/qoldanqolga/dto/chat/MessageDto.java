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
public class MessageDto {

    private Long id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String text;
    private Instant createdAt;
}

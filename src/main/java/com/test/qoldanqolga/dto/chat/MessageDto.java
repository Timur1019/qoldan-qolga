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

    private String id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String senderAvatar;
    private Boolean senderIsStore;
    private String text;
    private String attachmentUrl;
    /** TEXT, IMAGE, FILE */
    private String messageType;
    /** SENT, DELIVERED, READ — только для своих сообщений */
    private String status;
    private Instant createdAt;
}

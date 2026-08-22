package com.test.qoldanqolga.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/** Событие WebSocket в топике диалога: новое сообщение или прочтение. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatWsEventDto {

    /** MESSAGE | READ */
    private String type;
    private MessageDto message;
    private String readerId;
    private Instant readAt;
}

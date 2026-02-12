package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.model.ChatMessage;
import com.test.qoldanqolga.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChatMessageMapper extends BaseMapper<ChatMessage, MessageDto> {

    @Mapping(target = "id", source = "message.id")
    @Mapping(target = "conversationId", source = "message.conversationId")
    @Mapping(target = "senderId", source = "message.senderId")
    @Mapping(target = "text", source = "message.text")
    @Mapping(target = "createdAt", source = "message.createdAt")
    @Mapping(target = "senderName", expression = "java(sender != null ? sender.getDisplayName() : \"\")")
    @Mapping(target = "senderAvatar", source = "sender.avatar")
    MessageDto toDto(ChatMessage message, User sender);

    @Override
    default MessageDto toDto(ChatMessage message) {
        return toDto(message, message.getSender());
    }
}

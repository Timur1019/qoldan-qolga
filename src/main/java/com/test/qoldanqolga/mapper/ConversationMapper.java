package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.service.chat.ConversationStatistics;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ConversationMapper extends BaseMapper<Conversation, ConversationDto> {

    @Mapping(target = "id", source = "conversation.id")
    @Mapping(target = "adId", source = "conversation.adId")
    @Mapping(target = "createdAt", source = "conversation.createdAt")
    @Mapping(target = "adTitle", expression = "java(conversation.getAd() != null ? conversation.getAd().getTitle() : \"\")")
    @Mapping(target = "otherPartyName", expression = "java(otherUser != null ? otherUser.getDisplayName() : \"\")")
    @Mapping(target = "otherPartyId", source = "otherPartyId")
    @Mapping(target = "otherPartyAvatar", expression = "java(otherUser != null ? otherUser.getAvatar() : null)")
    @Mapping(target = "messageCount", source = "stats.messageCount")
    @Mapping(target = "incomingMessageCount", source = "stats.incomingMessageCount")
    @Mapping(target = "unreadCount", source = "stats.unreadCount")
    ConversationDto toDto(Conversation conversation, String otherPartyId, User otherUser, ConversationStatistics stats);

    @Override
    default ConversationDto toDto(Conversation conversation) {
        String otherPartyId = conversation.getBuyerId();
        User otherUser = conversation.getBuyer();
        if (conversation.getAd() != null) {
            otherPartyId = conversation.getAd().getUserId();
            otherUser = conversation.getAd().getUser();
        }
        ConversationStatistics stats = ConversationStatistics.builder()
                .messageCount(0).incomingMessageCount(0).unreadCount(0).build();
        return toDto(conversation, otherPartyId, otherUser, stats);
    }
}

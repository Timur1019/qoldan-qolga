package com.test.qoldanqolga.service.chat.chatImpl;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.ChatMessageMapper;
import com.test.qoldanqolga.mapper.ConversationMapper;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.ChatMessageRepository;
import com.test.qoldanqolga.repository.ConversationRepository;
import com.test.qoldanqolga.service.chat.ChatAccessService;
import com.test.qoldanqolga.service.chat.ConversationQueryService;
import com.test.qoldanqolga.service.chat.ConversationStatistics;
import com.test.qoldanqolga.service.chat.ConversationStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationQueryServiceImpl implements ConversationQueryService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final ConversationMapper conversationMapper;
    private final ChatMessageMapper chatMessageMapper;
    private final ChatAccessService chatAccessService;
    private final ConversationStatisticsService statisticsService;

    @Override
    @Transactional(readOnly = true)
    public List<ConversationDto> getConversationsForUser(String userId) {
        List<Conversation> conversations = conversationRepository.findAllByParticipant(userId);
        if (conversations.isEmpty()) {
            return List.of();
        }
        List<String> ids = conversations.stream().map(Conversation::getId).collect(Collectors.toList());
        var stats = statisticsService.getStatisticsBatch(ids, userId);

        return conversations.stream().map(c -> {
            String otherPartyId = c.getBuyerId().equals(userId)
                    ? (c.getAd() != null ? c.getAd().getUserId() : null)
                    : c.getBuyerId();
            User otherUser = c.getBuyerId().equals(userId) && c.getAd() != null ? c.getAd().getUser() : c.getBuyer();
            ConversationStatistics stat = stats.getOrDefault(c.getId(),
                    ConversationStatistics.builder().messageCount(0).incomingMessageCount(0).unreadCount(0).build());
            return conversationMapper.toDto(c, otherPartyId, otherUser, stat);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDto> getMessages(String conversationId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        chatAccessService.ensureParticipant(c, userId);
        return messageRepository.findByConversationIdWithSender(conversationId).stream()
                .map(chatMessageMapper::toDto)
                .collect(Collectors.toList());
    }
}

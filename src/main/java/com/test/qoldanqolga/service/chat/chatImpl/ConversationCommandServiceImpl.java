package com.test.qoldanqolga.service.chat.chatImpl;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.exception.SelfConversationException;
import com.test.qoldanqolga.mapper.ConversationMapper;
import com.test.qoldanqolga.model.Conversation;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.ChatMessageRepository;
import com.test.qoldanqolga.repository.ConversationReadRepository;
import com.test.qoldanqolga.repository.ConversationRepository;
import com.test.qoldanqolga.service.chat.ChatAccessService;
import com.test.qoldanqolga.service.chat.ConversationCommandService;
import com.test.qoldanqolga.service.chat.ConversationDtoEnricher;
import com.test.qoldanqolga.service.chat.ConversationStatistics;
import com.test.qoldanqolga.service.chat.ConversationStatisticsService;
import com.test.qoldanqolga.config.SystemConversationProperties;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConversationCommandServiceImpl implements ConversationCommandService {

    private final ConversationRepository conversationRepository;
    private final AdvertisementRepository advertisementRepository;
    private final ConversationReadRepository conversationReadRepository;
    private final ChatMessageRepository messageRepository;
    private final ConversationMapper conversationMapper;
    private final ChatAccessService chatAccessService;
    private final ConversationStatisticsService statisticsService;
    private final SystemConversationProperties systemConversationProperties;
    private final ConversationDtoEnricher conversationDtoEnricher;

    @Override
    @Transactional
    public String getOrCreateSystemConversation(String userId) {
        String systemAdId = systemConversationProperties.getAdId();
        Optional<Conversation> existing = conversationRepository.findByAdIdAndBuyerId(systemAdId, userId);
        if (existing.isPresent()) {
            return existing.get().getId();
        }
        LogUtil.info(ConversationCommandServiceImpl.class, "Creating system conversation for user={}", userId);
        Conversation c = new Conversation();
        c.setAdId(systemAdId);
        c.setBuyerId(userId);
        c = conversationRepository.save(c);
        return c.getId();
    }

    @Override
    @Transactional
    public ConversationDto getOrCreateConversation(String adId, String currentUserId) {
        var ad = advertisementRepository.findByIdWithUserAndImages(adId)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", adId));
        if (ad.getUserId().equals(currentUserId)) {
            throw new SelfConversationException(adId);
        }
        Optional<Conversation> existing = conversationRepository.findByAdIdAndBuyerId(adId, currentUserId);
        if (existing.isPresent()) {
            LogUtil.debug(ConversationCommandServiceImpl.class, "Existing conversation found: adId={} buyerId={}", adId, currentUserId);
            return toDto(existing.get(), currentUserId);
        }
        LogUtil.info(ConversationCommandServiceImpl.class, "Creating conversation for ad={} buyer={}", adId, currentUserId);
        Conversation c = new Conversation();
        c.setAdId(adId);
        c.setBuyerId(currentUserId);
        c = conversationRepository.save(c);
        var stats = ConversationStatistics.builder()
                .messageCount(0).incomingMessageCount(0).unreadCount(0).build();
        String otherPartyId = ad.getUserId();
        var otherUser = ad.getUser();
        ConversationDto dto = conversationMapper.toDto(c, otherPartyId, otherUser, stats);
        conversationDtoEnricher.enrich(dto, ad, otherUser, null);
        return dto;
    }

    @Override
    @Transactional
    public void deleteConversation(String conversationId, String userId) {
        Conversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Диалог", conversationId));
        chatAccessService.ensureParticipant(c, userId);
        LogUtil.info(ConversationCommandServiceImpl.class, "Deleting conversation {} by user {}", conversationId, userId);
        conversationReadRepository.deleteAllByConversationId(conversationId);
        messageRepository.deleteAllByConversationId(conversationId);
        conversationRepository.delete(c);
    }

    @Override
    @Transactional
    public void deleteAllConversationsByAdId(String adId) {
        List<Conversation> list = conversationRepository.findAllByAdId(adId);
        for (Conversation c : list) {
            conversationReadRepository.deleteAllByConversationId(c.getId());
            messageRepository.deleteAllByConversationId(c.getId());
            conversationRepository.delete(c);
        }
        if (!list.isEmpty()) {
            LogUtil.info(ConversationCommandServiceImpl.class, "Deleted {} conversation(s) for adId={}", list.size(), adId);
        }
    }

    private ConversationDto toDto(Conversation c, String currentUserId) {
        var statsMap = statisticsService.getStatisticsBatch(List.of(c.getId()), currentUserId);
        var stats = statsMap.getOrDefault(c.getId(),
                ConversationStatistics.builder().messageCount(0).incomingMessageCount(0).unreadCount(0).build());
        String otherPartyId = c.getBuyerId().equals(currentUserId)
                ? (c.getAd() != null ? c.getAd().getUserId() : null)
                : c.getBuyerId();
        var otherUser = c.getBuyerId().equals(currentUserId) && c.getAd() != null ? c.getAd().getUser() : c.getBuyer();
        ConversationDto dto = conversationMapper.toDto(c, otherPartyId, otherUser, stats);
        conversationDtoEnricher.enrich(dto, c.getAd(), otherUser, null);
        return dto;
    }
}

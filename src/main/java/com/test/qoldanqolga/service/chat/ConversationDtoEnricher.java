package com.test.qoldanqolga.service.chat;

import com.test.qoldanqolga.dto.chat.ConversationDto;
import com.test.qoldanqolga.dto.chat.MessageDto;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class ConversationDtoEnricher {

    private final AdvertisementMapper advertisementMapper;

    public void enrich(ConversationDto dto, Advertisement ad, User otherUser, LastMessagePreview lastMessage) {
        if (ad != null) {
            dto.setAdImageUrl(advertisementMapper.getMainImageUrl(ad));
            dto.setAdPrice(ad.getPrice());
            dto.setAdCurrency(ad.getCurrency());
            dto.setAdRegion(formatRegion(ad));
        }
        if (otherUser != null) {
            dto.setOtherPartyLastSeenAt(otherUser.getLastSeenAt());
        }
        if (lastMessage != null) {
            dto.setLastMessageText(lastMessage.previewText());
            dto.setLastMessageAt(lastMessage.createdAt());
        }
    }

    public String formatRegion(Advertisement ad) {
        if (ad == null) return "";
        String region = ad.getRegion() != null ? ad.getRegion().trim() : "";
        String district = ad.getDistrict() != null ? ad.getDistrict().trim() : "";
        if (!region.isEmpty() && !district.isEmpty()) return region + ", " + district;
        return !region.isEmpty() ? region : district;
    }

    public String resolveMessageStatus(String senderId, String currentUserId, Instant messageCreatedAt, Instant otherLastReadAt) {
        if (senderId == null || !senderId.equals(currentUserId) || messageCreatedAt == null) {
            return null;
        }
        if (otherLastReadAt != null && !messageCreatedAt.isAfter(otherLastReadAt)) {
            return "READ";
        }
        return "DELIVERED";
    }

    public String previewForMessage(String text, String messageType, String attachmentUrl) {
        if (text != null && !text.isBlank()) {
            return text.length() > 120 ? text.substring(0, 117) + "…" : text;
        }
        if ("IMAGE".equals(messageType) || (attachmentUrl != null && !attachmentUrl.isBlank())) {
            return "📷";
        }
        if ("FILE".equals(messageType)) {
            return "📎";
        }
        return "";
    }

    public record LastMessagePreview(String previewText, Instant createdAt) {}
}

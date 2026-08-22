package com.test.qoldanqolga.service.notification.impl;

import com.test.qoldanqolga.dto.notification.NotificationDto;
import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.dto.notification.NotificationPreferenceDto;
import com.test.qoldanqolga.mapper.NotificationMapper;
import com.test.qoldanqolga.model.Notification;
import com.test.qoldanqolga.model.NotificationPreference;
import com.test.qoldanqolga.repository.NotificationPreferenceRepository;
import com.test.qoldanqolga.repository.NotificationRepository;
import com.test.qoldanqolga.service.notification.ChatNotificationGrouper;
import com.test.qoldanqolga.service.notification.NotificationDeepLinkBuilder;
import com.test.qoldanqolga.service.notification.NotificationPushDispatcher;
import com.test.qoldanqolga.service.notification.NotificationService;
import com.test.qoldanqolga.util.AfterCommit;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private static final ZoneId QUIET_ZONE = ZoneId.of("Asia/Tashkent");

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final NotificationMapper notificationMapper;
    private final ChatNotificationGrouper chatNotificationGrouper;
    private final NotificationDeepLinkBuilder deepLinkBuilder;
    private final NotificationPushDispatcher pushDispatcher;

    @Override
    @Transactional
    public void publish(NotificationEvent event) {
        if (event == null || event.getRecipientUserId() == null || event.getRecipientUserId().isBlank()) {
            return;
        }
        if (!event.getType().isPushEnabled()) {
            return;
        }

        Notification notification = resolveNotification(event);
        notification = notificationRepository.save(notification);
        final Notification saved = notification;

        boolean skipPush = isQuietHours(event) && !event.getType().isMandatory();
        if (!skipPush) {
            AfterCommit.run(() -> pushDispatcher.dispatch(saved));
        }

        LogUtil.debug(NotificationServiceImpl.class,
                "Notification published: type={} userId={} id={}",
                event.getType(), event.getRecipientUserId(), saved.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDto> getInbox(String userId, Pageable pageable) {
        return notificationRepository.findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(userId, pageable)
                .map(notificationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalseAndDeletedAtIsNull(userId);
    }

    @Override
    @Transactional
    public void markRead(String userId, Iterable<String> ids) {
        notificationRepository.markRead(userId, ids, Instant.now());
    }

    @Override
    @Transactional
    public void markAllRead(String userId) {
        notificationRepository.markAllRead(userId, Instant.now());
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationPreferenceDto getPreferences(String userId) {
        return toPreferenceDto(findOrCreatePreferences(userId));
    }

    @Override
    @Transactional
    public NotificationPreferenceDto updatePreferences(String userId, NotificationPreferenceDto request) {
        NotificationPreference prefs = findOrCreatePreferences(userId);
        applyPreferences(prefs, request);
        return toPreferenceDto(preferenceRepository.save(prefs));
    }

    private Notification resolveNotification(NotificationEvent event) {
        Notification existing = chatNotificationGrouper.findGroupable(event);
        if (existing != null) {
            int count = existing.getGroupCount() != null ? existing.getGroupCount() + 1 : 2;
            existing.setGroupCount(count);
            existing.setBody(chatNotificationGrouper.buildGroupedBody(count));
            existing.setPushSent(false);
            return existing;
        }

        Notification notification = new Notification();
        notification.setUserId(event.getRecipientUserId());
        notification.setType(event.getType());
        notification.setCategory(event.getType().getCategory());
        notification.setTitle(resolveTitle(event));
        notification.setBody(resolveBody(event));
        notification.setEntityType(event.getEntityType());
        notification.setEntityId(event.getEntityId());
        notification.setPayload(deepLinkBuilder.buildPayload(event));
        if (event.getType().isGroupable()) {
            notification.setGroupKey(chatNotificationGrouper.buildGroupKey(event));
        }
        notification.setGroupCount(1);
        return notification;
    }

    private boolean isQuietHours(NotificationEvent event) {
        return preferenceRepository.findByUserIdAndDeletedAtIsNull(event.getRecipientUserId())
                .map(this::inQuietHours)
                .orElse(false);
    }

    private boolean inQuietHours(NotificationPreference prefs) {
        if (!Boolean.TRUE.equals(prefs.getQuietHoursEnabled())) {
            return false;
        }
        String startRaw = prefs.getQuietHoursStart();
        String endRaw = prefs.getQuietHoursEnd();
        if (startRaw == null || endRaw == null) {
            return false;
        }
        try {
            LocalTime start = LocalTime.parse(startRaw);
            LocalTime end = LocalTime.parse(endRaw);
            LocalTime now = ZonedDateTime.now(QUIET_ZONE).toLocalTime();
            if (start.isBefore(end)) {
                return !now.isBefore(start) && now.isBefore(end);
            }
            return !now.isBefore(start) || now.isBefore(end);
        } catch (Exception e) {
            return false;
        }
    }

    private NotificationPreference findOrCreatePreferences(String userId) {
        return preferenceRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseGet(() -> {
                    NotificationPreference prefs = new NotificationPreference();
                    prefs.setUserId(userId);
                    return preferenceRepository.save(prefs);
                });
    }

    private static String resolveTitle(NotificationEvent event) {
        if (event.getTitle() != null && !event.getTitle().isBlank()) {
            return event.getTitle().trim();
        }
        return switch (event.getType()) {
            case NEW_MESSAGE, MESSAGE_REPLY, VOICE_MESSAGE, PHOTO_MESSAGE -> "Сообщение";
            case SYSTEM_MESSAGE -> "Уведомление";
            case PROMOTION_ACTIVE, PROMOTION_PAID -> "Продвижение";
            case FAVORITE_ADDED -> "Избранное";
            case AD_PUBLISHED -> "Объявление опубликовано";
            case NEW_LOGIN, NEW_DEVICE_LOGIN -> "Безопасность";
            case NEW_REVIEW -> "Новый отзыв";
            default -> "Qoldan Qolga";
        };
    }

    private static String resolveBody(NotificationEvent event) {
        if (event.getBody() != null && !event.getBody().isBlank()) {
            return event.getBody().trim();
        }
        return resolveTitle(event);
    }

    private static void applyPreferences(NotificationPreference prefs, NotificationPreferenceDto request) {
        if (request.getPushEnabled() != null) prefs.setPushEnabled(request.getPushEnabled());
        if (request.getChatEnabled() != null) prefs.setChatEnabled(request.getChatEnabled());
        if (request.getFavoriteEnabled() != null) prefs.setFavoriteEnabled(request.getFavoriteEnabled());
        if (request.getAdEnabled() != null) prefs.setAdEnabled(request.getAdEnabled());
        if (request.getPromotionEnabled() != null) prefs.setPromotionEnabled(request.getPromotionEnabled());
        if (request.getPaymentEnabled() != null) prefs.setPaymentEnabled(request.getPaymentEnabled());
        if (request.getProfileEnabled() != null) prefs.setProfileEnabled(request.getProfileEnabled());
        if (request.getDealEnabled() != null) prefs.setDealEnabled(request.getDealEnabled());
        if (request.getRegionalEnabled() != null) prefs.setRegionalEnabled(request.getRegionalEnabled());
        if (request.getMarketingEnabled() != null) prefs.setMarketingEnabled(request.getMarketingEnabled());
        if (request.getQuietHoursEnabled() != null) prefs.setQuietHoursEnabled(request.getQuietHoursEnabled());
        if (request.getQuietHoursStart() != null) prefs.setQuietHoursStart(request.getQuietHoursStart());
        if (request.getQuietHoursEnd() != null) prefs.setQuietHoursEnd(request.getQuietHoursEnd());
    }

    private static NotificationPreferenceDto toPreferenceDto(NotificationPreference prefs) {
        NotificationPreferenceDto dto = new NotificationPreferenceDto();
        dto.setPushEnabled(prefs.getPushEnabled());
        dto.setChatEnabled(prefs.getChatEnabled());
        dto.setFavoriteEnabled(prefs.getFavoriteEnabled());
        dto.setAdEnabled(prefs.getAdEnabled());
        dto.setPromotionEnabled(prefs.getPromotionEnabled());
        dto.setPaymentEnabled(prefs.getPaymentEnabled());
        dto.setProfileEnabled(prefs.getProfileEnabled());
        dto.setDealEnabled(prefs.getDealEnabled());
        dto.setRegionalEnabled(prefs.getRegionalEnabled());
        dto.setMarketingEnabled(prefs.getMarketingEnabled());
        dto.setQuietHoursEnabled(prefs.getQuietHoursEnabled());
        dto.setQuietHoursStart(prefs.getQuietHoursStart());
        dto.setQuietHoursEnd(prefs.getQuietHoursEnd());
        return dto;
    }
}

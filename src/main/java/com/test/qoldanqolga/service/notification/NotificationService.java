package com.test.qoldanqolga.service.notification;

import com.test.qoldanqolga.dto.notification.NotificationDto;
import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.dto.notification.NotificationPreferenceDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    void publish(NotificationEvent event);

    Page<NotificationDto> getInbox(String userId, Pageable pageable);

    long getUnreadCount(String userId);

    void markRead(String userId, Iterable<String> ids);

    void markAllRead(String userId);

    NotificationPreferenceDto getPreferences(String userId);

    NotificationPreferenceDto updatePreferences(String userId, NotificationPreferenceDto request);
}

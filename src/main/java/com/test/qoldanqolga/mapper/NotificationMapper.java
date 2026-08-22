package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.notification.NotificationDto;
import com.test.qoldanqolga.model.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification entity) {
        if (entity == null) {
            return null;
        }
        NotificationDto dto = new NotificationDto();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setCategory(entity.getCategory());
        dto.setTitle(entity.getTitle());
        dto.setBody(entity.getBody());
        dto.setEntityType(entity.getEntityType());
        dto.setEntityId(entity.getEntityId());
        dto.setPayload(entity.getPayload());
        dto.setGroupCount(entity.getGroupCount());
        dto.setIsRead(entity.getIsRead());
        dto.setReadAt(entity.getReadAt());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}

package com.test.qoldanqolga.service.component;

import com.test.qoldanqolga.exception.AdAccessDeniedException;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.util.LogUtil;
import org.springframework.stereotype.Component;

/**
 * Проверка прав доступа к объявлениям.
 */
@Component
public class AdPermissionService {

    /**
     * Проверяет, что пользователь является владельцем объявления.
     *
     * @throws AdAccessDeniedException если пользователь не владелец
     */
    public void validateOwnership(Advertisement ad, String userId) {
        if (ad == null || userId == null) return;
        if (!ad.getUserId().equals(userId)) {
            LogUtil.warn(AdPermissionService.class, "Access denied: adId={} userId={}", ad.getId(), userId);
            throw new AdAccessDeniedException(ad.getId(), userId);
        }
    }
}

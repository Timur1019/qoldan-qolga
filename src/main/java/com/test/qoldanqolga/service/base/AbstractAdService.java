package com.test.qoldanqolga.service.base;

import com.test.qoldanqolga.constant.AdConstants;
import org.springframework.cache.annotation.CacheEvict;

/**
 * Базовый класс для сервисов объявлений.
 */
public abstract class AbstractAdService {

    @CacheEvict(value = "adsList", allEntries = true)
    protected void clearListCache() {
    }

    protected String getEffectiveStatus(String status) {
        return status != null && !status.isBlank() ? status : AdConstants.STATUS_ACTIVE;
    }
}

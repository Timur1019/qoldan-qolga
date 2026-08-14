package com.test.qoldanqolga.util;

import com.test.qoldanqolga.constant.AdConstants;

/**
 * Утилиты для маппинга CreateAdRequest → Advertisement.
 * Вынесены для избежания ambiguity в MapStruct.
 */
public final class CreateAdMapperHelper {

    private CreateAdMapperHelper() {
    }

    public static String trim(String s) {
        return s != null ? s.trim() : null;
    }

    /** trim + схлопывание дублей Manzil/Адрес в description */
    public static String normalizeDescription(String s) {
        if (s == null) {
            return null;
        }
        return AdDescriptionLocationUtil.normalize(s.trim());
    }

    public static String trimOrNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }

    public static String defaultCurrency(String s) {
        return (s != null && !s.isBlank()) ? s : AdConstants.CURRENCY_DEFAULT;
    }

    public static String defaultCategory(String s) {
        return (s != null && !s.isBlank()) ? s : AdConstants.CATEGORY_DEFAULT;
    }

    public static String nonBlankOrNull(String s) {
        return (s != null && !s.isBlank()) ? s : null;
    }

    /** USED | NEW; по умолчанию USED */
    public static String defaultItemCondition(String s) {
        return (s != null && !s.isBlank()) ? s.trim() : "USED";
    }

    /**
     * Объём двигателя в литрах. Если передали см³ (>= 50), переводим в литры.
     */
    public static java.math.BigDecimal normalizeEngineVolume(java.math.BigDecimal volume) {
        if (volume == null) {
            return null;
        }
        if (volume.compareTo(java.math.BigDecimal.valueOf(50)) >= 0) {
            return volume.divide(java.math.BigDecimal.valueOf(1000), 2, java.math.RoundingMode.HALF_UP);
        }
        return volume.setScale(2, java.math.RoundingMode.HALF_UP);
    }
}

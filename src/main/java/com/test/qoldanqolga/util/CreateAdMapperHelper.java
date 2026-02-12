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
}

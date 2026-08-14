package com.test.qoldanqolga.util;

import com.test.qoldanqolga.exception.BusinessException;
import com.test.qoldanqolga.exception.ErrorCode;

/**
 * Нормализация телефонных номеров для OTP / DevSMS.
 */
public final class PhoneUtil {

    private PhoneUtil() {
    }

    /**
     * Возвращает цифры без «+»: 998901234567 или международный формат.
     * Локальные 9 цифр (90…, 88…, 33…) дополняются кодом 998.
     */
    public static String normalize(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new BusinessException(ErrorCode.PHONE_INVALID);
        }
        String digits = raw.replaceAll("\\D", "");
        if (digits.isEmpty()) {
            throw new BusinessException(ErrorCode.PHONE_INVALID);
        }
        if (digits.startsWith("998") && digits.length() == 12) {
            return digits;
        }
        // Локальный UZ: 9 цифр без кода страны (90, 91, 93, 94, 95, 97, 99, 88, 33…)
        if (digits.length() == 9) {
            return "998" + digits;
        }
        // Старый формат 8XXXXXXXXX
        if (digits.startsWith("8") && digits.length() == 10) {
            return "998" + digits.substring(1);
        }
        if (digits.length() >= 10 && digits.length() <= 15) {
            return digits;
        }
        throw new BusinessException(ErrorCode.PHONE_INVALID);
    }

    public static String mask(String normalized) {
        if (normalized == null || normalized.length() < 4) {
            return "****";
        }
        String last4 = normalized.substring(normalized.length() - 4);
        if (normalized.startsWith("998") && normalized.length() == 12) {
            return "+998 ** *** " + last4.substring(0, 2) + " " + last4.substring(2);
        }
        return "***" + last4;
    }
}

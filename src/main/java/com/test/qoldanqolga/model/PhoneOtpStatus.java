package com.test.qoldanqolga.model;

/**
 * Статус жизненного цикла OTP-сессии.
 */
public enum PhoneOtpStatus {
    PENDING,
    SENT,
    VERIFIED,
    EXPIRED,
    FAILED,
    BLOCKED
}

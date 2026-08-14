package com.test.qoldanqolga.service.sms;

import com.test.qoldanqolga.dto.devsms.DevSmsSendResult;

public interface DevSmsClient {

    /**
     * OTP через universal_otp шаблон Eskiz (без модерации своего текста).
     *
     * @param templateType 1=операция, 2=пароль, 3=регистрация, 4=вход
     */
    DevSmsSendResult sendOtp(String phone, String otpCode, int templateType);
}

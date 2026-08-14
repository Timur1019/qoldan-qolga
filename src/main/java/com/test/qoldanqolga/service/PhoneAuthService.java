package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.auth.AuthResponse;
import com.test.qoldanqolga.dto.auth.PhoneSendCodeRequest;
import com.test.qoldanqolga.dto.auth.PhoneSendCodeResponse;
import com.test.qoldanqolga.dto.auth.PhoneVerifyRequest;
import com.test.qoldanqolga.dto.auth.SmsCallbackRequest;

public interface PhoneAuthService {

    PhoneSendCodeResponse sendCode(PhoneSendCodeRequest request);

    AuthResponse verify(PhoneVerifyRequest request);

    void handleSmsCallback(SmsCallbackRequest request);
}

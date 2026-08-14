package com.test.qoldanqolga.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhoneSendCodeResponse {

    private String phone;
    private String phoneMasked;
    private int expiresInSeconds;
    private int resendAfterSeconds;
    private String otpStatus;
    private String smsStatus;
    /** Только в mock-режиме (без DevSMS токена). */
    private String debugCode;
}

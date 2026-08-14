package com.test.qoldanqolga.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompleteVerificationResponse {

    private boolean profileVerified;
    private String message;
}

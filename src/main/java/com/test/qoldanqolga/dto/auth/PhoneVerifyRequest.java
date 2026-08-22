package com.test.qoldanqolga.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PhoneVerifyRequest {

    @NotBlank
    private String phone;

    @NotBlank
    @Size(min = 4, max = 8)
    private String code;

    @Size(max = 100)
    private String displayName;

    @Size(max = 64)
    private String deviceId;

    @Size(max = 16)
    private String platform;
}

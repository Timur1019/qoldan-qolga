package com.test.qoldanqolga.dto.push;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterPushTokenRequest {

    @NotBlank
    private String token;

    @NotBlank
    private String platform;

    private Boolean chatEnabled = true;
    private Boolean systemEnabled = true;
    private Boolean promoEnabled = true;
}

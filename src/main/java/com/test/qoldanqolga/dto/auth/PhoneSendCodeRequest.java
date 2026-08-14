package com.test.qoldanqolga.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PhoneSendCodeRequest {

    @NotBlank
    private String phone;
}

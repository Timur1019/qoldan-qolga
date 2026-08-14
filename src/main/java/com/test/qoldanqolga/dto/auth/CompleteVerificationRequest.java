package com.test.qoldanqolga.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompleteVerificationRequest {

    @NotBlank(message = "Укажите auth_code")
    private String authCode;

    @NotBlank(message = "Укажите session_id")
    private String sessionId;
}

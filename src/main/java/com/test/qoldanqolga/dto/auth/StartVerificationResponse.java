package com.test.qoldanqolga.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StartVerificationResponse {

    private String redirectUrl;
    private String embedUrl;
    @JsonProperty("message")
    private String message;
}

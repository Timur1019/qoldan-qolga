package com.test.qoldanqolga.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class SmsCallbackRequest {

    @JsonProperty("sms_id")
    private Long smsId;

    @JsonProperty("request_id")
    private String requestId;

    private String phone;
    private String status;

    @JsonProperty("sent_at")
    private String sentAt;

    @JsonProperty("delivered_at")
    private String deliveredAt;

    @JsonProperty("failed_at")
    private String failedAt;

    private String timestamp;
}

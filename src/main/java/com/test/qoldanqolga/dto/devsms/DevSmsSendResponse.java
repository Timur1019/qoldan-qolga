package com.test.qoldanqolga.dto.devsms;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class DevSmsSendResponse {

    private Boolean success;
    private String message;
    private Data data;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        @JsonProperty("sms_id")
        private Long smsId;
        @JsonProperty("request_id")
        private String requestId;
        private String status;
        @JsonProperty("parts_count")
        private Integer partsCount;
        @JsonProperty("total_cost")
        private Integer totalCost;
        private Integer balance;
        private String type;
        private String country;
        @JsonProperty("country_code")
        private String countryCode;
    }
}

package com.test.qoldanqolga.dto.devsms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DevSmsSendResult {

    private Long smsId;
    private String requestId;
    private String status;
    private Integer partsCount;
    private Integer totalCost;
    private boolean mock;
}

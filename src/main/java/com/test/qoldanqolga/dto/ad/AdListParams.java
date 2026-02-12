package com.test.qoldanqolga.dto.ad;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdListParams {
    private String status;
    private String category;
    private String region;
    private String query;
    private String sellerType;
    private Boolean hasLicense;
    private Boolean worksByContract;
    private BigDecimal priceFrom;
    private BigDecimal priceTo;
    private String currency;
    private Boolean urgentBargain;
    private Boolean canDeliver;
    private Boolean giveAway;
}

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
    /** Несколько значений: фильтр по любому из типов продавца (PRIVATE, BUSINESS). */
    private List<String> sellerType;
    private Boolean hasLicense;
    private Boolean worksByContract;
    private BigDecimal priceFrom;
    private BigDecimal priceTo;
    private String currency;
    private Boolean urgentBargain;
    private Boolean canDeliver;
    private Boolean giveAway;
    private String brandId;
    /** Список состояний: фильтр по любому из (USED, NEW, HANDMADE, USED_LIKE_NEW и т.д.). */
    private List<String> itemCondition;
    /** true = только ручная работа, false = исключить ручную работу, null = без фильтра */
    private Boolean handMadeOnly;
    /** true = возможна аренда (для одежды/обуви) */
    private Boolean canRent;
}

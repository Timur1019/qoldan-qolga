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

    /**
     * Request alias for search query param {@code q}.
     * Spring binds {@code ?q=} via this setter.
     */
    public void setQ(String q) {
        this.query = q;
    }
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
    private String modelId;
    private Integer yearFrom;
    private Integer yearTo;
    private Integer mileageFrom;
    private Integer mileageTo;
    private List<String> bodyType;
    private List<String> transmission;
    private List<String> fuelType;
    private List<String> driveType;
    private BigDecimal engineVolumeFrom;
    private BigDecimal engineVolumeTo;
    private List<String> exteriorColor;
    private List<String> seats;
    private List<String> steering;
    private List<String> ownersCount;
    private String district;
    private List<String> dealType;
    private List<String> rooms;
    private BigDecimal areaFrom;
    private BigDecimal areaTo;
    private BigDecimal landAreaFrom;
    private BigDecimal landAreaTo;
    private Integer floorFrom;
    private Integer floorTo;
    private List<String> buildingType;
    private List<String> renovation;
    private Boolean furnished;
}

package com.test.qoldanqolga.dto.promo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromoServiceDto {
    private String code;
    private String nameRu;
    private String nameUz;
    private BigDecimal price;
    private Integer durationDays;
    private String descriptionRu;
    private String descriptionUz;
    private Integer priority;
    private Integer boostIntervalHours;
    private Boolean vip;
    private Boolean top;
    private Boolean highlight;
    private List<String> featuresRu = new ArrayList<>();
    private List<String> featuresUz = new ArrayList<>();
}

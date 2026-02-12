package com.test.qoldanqolga.dto.promo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

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
}

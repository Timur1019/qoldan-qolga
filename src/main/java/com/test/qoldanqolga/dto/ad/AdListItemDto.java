package com.test.qoldanqolga.dto.ad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdListItemDto {
    private Long id;
    private String title;
    private BigDecimal price;
    private String currency;
    private String category;
    private String region;
    private String status;
    private Boolean isNegotiable;
    private String mainImageUrl;
    private Instant createdAt;
    private Boolean favorite;
}

package com.test.qoldanqolga.dto.ad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdDetailDto {
    private String id;
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private String category;
    private String phone;
    private String email;
    private String region;
    private String district;
    private String status;
    private Boolean isNegotiable;
    private Boolean canDeliver;
    private String sellerType;
    private Boolean hasLicense;
    private Boolean worksByContract;
    private Boolean urgentBargain;
    private Boolean giveAway;
    private String userId;
    private String userDisplayName;
    private Integer views;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant expiresAt;
    private List<AdImageDto> images;
    private Boolean favorite;
}

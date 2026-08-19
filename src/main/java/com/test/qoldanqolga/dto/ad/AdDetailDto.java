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
    private String brandId;
    private String brandNameUz;
    private String brandNameRu;
    private String modelId;
    private String modelNameUz;
    private String modelNameRu;
    private String modelCustom;
    private Integer year;
    private Integer mileage;
    private String bodyType;
    private String transmission;
    private String fuelType;
    private String driveType;
    private BigDecimal engineVolume;
    private String exteriorColor;
    private Integer seats;
    private String steering;
    private Integer ownersCount;
    private String dealType;
    private Integer rooms;
    private BigDecimal areaM2;
    private BigDecimal landAreaM2;
    private Integer floor;
    private Integer floorsTotal;
    private String buildingType;
    private String renovation;
    private Boolean furnished;
    private String itemCondition;
    private String phone;
    private String telegramUsername;
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
    private Boolean onlineShowing;
    private Boolean canRent;
    private String userId;
    private String userDisplayName;
    private Boolean sellerIsStore;
    private Integer views;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant expiresAt;
    private BigDecimal locationLat;
    private BigDecimal locationLng;
    private List<AdImageDto> images;
    private Boolean favorite;
    private Boolean isVip;
    private Boolean isTop;
    private Boolean isHighlighted;
    private Instant promoUntil;
    private String jobProfession;
    private String jobIndustry;
    private String jobPriority;
    private String jobEmployment;
    private String jobSchedule;
    private String jobWorkFormat;
    private String jobSalaryPeriod;
    private String jobPayFrequency;
    private String jobExperience;
    private String jobCitizenship;
    private Integer jobAgeFrom;
    private Integer jobAgeTo;
    private Boolean jobCompanyVerified;
    private Boolean jobLargeCompany;
    private String jobBenefits;
    private String jobForCandidates;
}

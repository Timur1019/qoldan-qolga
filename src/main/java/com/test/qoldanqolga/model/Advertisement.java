package com.test.qoldanqolga.model;

import com.test.qoldanqolga.constant.AdConstants;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "advertisements", indexes = {
        @Index(name = "idx_ad_user_id", columnList = "user_id"),
        @Index(name = "idx_ad_status", columnList = "status"),
        @Index(name = "idx_ad_category", columnList = "category"),
        @Index(name = "idx_ad_created_at", columnList = "created_at")
})
@Getter
@Setter
public class Advertisement extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal price;

    @Column(length = 3)
    private String currency = AdConstants.CURRENCY_DEFAULT;

    @Column(nullable = false, length = 50)
    private String category = AdConstants.CATEGORY_DEFAULT;

    @Column(nullable = false, length = 20)
    private String phone;

    /** Telegram username (без @) для перехода в чат: t.me/username */
    @Column(name = "telegram_username", length = 64)
    private String telegramUsername;

    @Column(length = 100)
    private String email;

    @Column(length = 50)
    private String region;

    @Column(length = 50)
    private String district;

    @Column(nullable = false, length = 20)
    private String status = AdConstants.STATUS_ACTIVE;

    @Column(nullable = false)
    private Boolean isNegotiable = false;

    @Column(name = "can_deliver", nullable = false)
    private Boolean canDeliver = false;

    @Column(name = "seller_type", length = 20)
    private String sellerType;

    @Column(name = "has_license", nullable = false)
    private Boolean hasLicense = false;

    @Column(name = "works_by_contract", nullable = false)
    private Boolean worksByContract = false;

    @Column(name = "urgent_bargain", nullable = false)
    private Boolean urgentBargain = false;

    @Column(name = "give_away", nullable = false)
    private Boolean giveAway = false;

    /** Онлайн-показ (недвижимость и др.). */
    @Column(name = "online_showing", nullable = false)
    private Boolean onlineShowing = false;

    @Column(name = "location_lat", precision = 10, scale = 7)
    private BigDecimal locationLat;

    @Column(name = "location_lng", precision = 10, scale = 7)
    private BigDecimal locationLng;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "brand_id", length = 36)
    private String brandId;

    /** Состояние: USED, USED_LIKE_NEW, USED_GOOD, USED_FAIR, NEW, HANDMADE */
    @Column(name = "item_condition", length = 25, nullable = false)
    private String itemCondition = "USED";

    /** Возможна аренда (для одежды, обуви) */
    @Column(name = "can_rent", nullable = false)
    private Boolean canRent = false;

    @Column(name = "model_id", length = 36)
    private String modelId;

    @Column(name = "model_custom", length = 100)
    private String modelCustom;

    @Column(name = "year")
    private Integer year;

    @Column(name = "mileage")
    private Integer mileage;

    @Column(name = "body_type", length = 30)
    private String bodyType;

    @Column(name = "transmission", length = 20)
    private String transmission;

    @Column(name = "fuel_type", length = 20)
    private String fuelType;

    @Column(name = "drive_type", length = 10)
    private String driveType;

    @Column(name = "engine_volume", precision = 8, scale = 2)
    private BigDecimal engineVolume;

    @Column(name = "exterior_color", length = 30)
    private String exteriorColor;

    @Column(name = "seats")
    private Integer seats;

    @Column(name = "steering", length = 10)
    private String steering;

    @Column(name = "owners_count")
    private Integer ownersCount;

    /** SALE | RENT */
    @Column(name = "deal_type", length = 10)
    private String dealType;

    /** 0 = студия, 1..N комнат */
    @Column(name = "rooms")
    private Integer rooms;

    @Column(name = "area_m2", precision = 10, scale = 2)
    private BigDecimal areaM2;

    @Column(name = "land_area_m2", precision = 12, scale = 2)
    private BigDecimal landAreaM2;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "floors_total")
    private Integer floorsTotal;

    @Column(name = "building_type", length = 20)
    private String buildingType;

    @Column(name = "renovation", length = 20)
    private String renovation;

    @Column(name = "furnished", nullable = false)
    private Boolean furnished = false;

    @Column(name = "job_profession", length = 80)
    private String jobProfession;

    @Column(name = "job_industry", length = 50)
    private String jobIndustry;

    @Column(name = "job_priority", length = 30)
    private String jobPriority;

    @Column(name = "job_employment", length = 80)
    private String jobEmployment;

    @Column(name = "job_schedule", length = 80)
    private String jobSchedule;

    @Column(name = "job_work_format", length = 30)
    private String jobWorkFormat;

    @Column(name = "job_salary_period", length = 20)
    private String jobSalaryPeriod;

    @Column(name = "job_pay_frequency", length = 80)
    private String jobPayFrequency;

    @Column(name = "job_experience", length = 30)
    private String jobExperience;

    @Column(name = "job_citizenship", length = 40)
    private String jobCitizenship;

    @Column(name = "job_age_from")
    private Integer jobAgeFrom;

    @Column(name = "job_age_to")
    private Integer jobAgeTo;

    @Column(name = "job_company_verified", nullable = false)
    private Boolean jobCompanyVerified = false;

    @Column(name = "job_large_company", nullable = false)
    private Boolean jobLargeCompany = false;

    @Column(name = "job_benefits", length = 120)
    private String jobBenefits;

    @Column(name = "job_for_candidates", length = 120)
    private String jobForCandidates;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", insertable = false, updatable = false)
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", insertable = false, updatable = false)
    private VehicleModel vehicleModel;

    @Column(nullable = false)
    private Integer views = 0;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "is_vip", nullable = false)
    private Boolean isVip = false;

    @Column(name = "is_top", nullable = false)
    private Boolean isTop = false;

    @Column(name = "is_highlighted", nullable = false)
    private Boolean isHighlighted = false;

    @Column(name = "promo_priority", nullable = false)
    private Integer promoPriority = 0;

    @Column(name = "promo_until")
    private Instant promoUntil;

    @Column(name = "boosted_at")
    private Instant boostedAt;

    @Column(name = "next_boost_at")
    private Instant nextBoostAt;

    @Column(name = "boost_interval_hours")
    private Integer boostIntervalHours;

    @OneToMany(mappedBy = "ad", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderNum, id")
    private List<AdImage> images = new ArrayList<>();

}

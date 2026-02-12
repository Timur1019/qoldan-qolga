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

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(nullable = false)
    private Integer views = 0;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @OneToMany(mappedBy = "ad", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderNum, id")
    private List<AdImage> images = new ArrayList<>();

}

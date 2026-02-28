package com.test.qoldanqolga.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Заявка на статус «Магазин» (Qoldan Qolga для бизнеса).
 */
@Entity
@Table(name = "business_applications")
@Getter
@Setter
public class BusinessApplication extends BaseEntity {

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "shop_name", nullable = false, length = 200)
    private String shopName;

    @Column(name = "business_type", nullable = false, length = 20)
    private String businessType;

    @Column(name = "passport_url", nullable = false, length = 500)
    private String passportUrl;

    @Column(name = "registration_certificate_url", nullable = false, length = 500)
    private String registrationCertificateUrl;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "product_category", nullable = false, length = 50)
    private String productCategory;

    @Column(name = "shop_url", length = 500)
    private String shopUrl;

    @Column(name = "phone", nullable = false, length = 30)
    private String phone;

    @Column(name = "agreement_accepted", nullable = false)
    private Boolean agreementAccepted = true;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "PENDING";
}

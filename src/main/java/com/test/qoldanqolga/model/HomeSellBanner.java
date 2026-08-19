package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Зелёный CTA-баннер на главной и в ленте объявлений.
 */
@Entity
@Table(name = "home_sell_banners")
@Getter
@Setter
public class HomeSellBanner extends BaseEntity {

    @Column(length = 120)
    private String kicker;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(length = 500)
    private String subtitle;

    @Column(name = "cta_text", length = 120)
    private String ctaText;

    @Column(name = "cta_url", length = 500)
    private String ctaUrl;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}

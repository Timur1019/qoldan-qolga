package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Баннер блока «Выгодно и полезно» на главной странице.
 */
@Entity
@Table(name = "home_promo_banners")
@Getter
@Setter
public class HomePromoBanner extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String subtitle;

    @Column(length = 100)
    private String badge;

    @Column(length = 500)
    private String link;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}

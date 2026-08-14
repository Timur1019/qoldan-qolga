package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Узкая рекламная полоса над шапкой сайта (управляется из админки).
 */
@Entity
@Table(name = "site_top_banners")
@Getter
@Setter
public class SiteTopBanner extends BaseEntity {

    @Column(nullable = false, length = 300)
    private String title;

    @Column(name = "link_text", length = 100)
    private String linkText;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "icon_url", length = 500)
    private String iconUrl;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;
}

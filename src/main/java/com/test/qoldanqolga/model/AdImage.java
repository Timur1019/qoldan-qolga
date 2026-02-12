package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ad_images")
@Getter
@Setter
public class AdImage extends BaseEntity {

    @Column(name = "ad_id", nullable = false, length = 36)
    private String adId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ad_id", insertable = false, updatable = false)
    private Advertisement ad;

    @Column(nullable = false, length = 500)
    private String url;

    @Column(name = "is_main", nullable = false)
    private Boolean isMain = false;

    @Column(name = "order_num", nullable = false)
    private Integer orderNum = 0;
}

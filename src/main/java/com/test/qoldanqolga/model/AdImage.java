package com.test.qoldanqolga.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ad_images")
@Getter
@Setter
public class AdImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ad_id", nullable = false)
    private Long adId;

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

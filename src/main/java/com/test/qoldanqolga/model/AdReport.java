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
@Table(name = "ad_reports")
@Getter
@Setter
public class AdReport extends BaseEntity {

    @Column(name = "ad_id", nullable = false, length = 36)
    private String adId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ad_id", insertable = false, updatable = false)
    private Advertisement advertisement;

    @Column(name = "reporter_id", nullable = false, length = 36)
    private String reporterId;

    @Column(nullable = false, length = 50)
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String comment;
}

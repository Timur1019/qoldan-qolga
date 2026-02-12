package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "ad_views")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class AdView extends BaseEntity {

    @Column(name = "ad_id", nullable = false, length = 36)
    private String adId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ad_id", insertable = false, updatable = false)
    private Advertisement ad;

    @Column(name = "user_id", length = 36)
    private String userId;

    @CreatedDate
    @Column(name = "viewed_at")
    private Instant viewedAt;
}

package com.test.qoldanqolga.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "ad_views")
@Getter
@Setter
public class AdView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ad_id", nullable = false)
    private Long adId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ad_id", insertable = false, updatable = false)
    private Advertisement ad;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "viewed_at")
    private Instant viewedAt;

    @PrePersist
    public void prePersist() {
        if (viewedAt == null) viewedAt = Instant.now();
    }
}

package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(name = "uk_favorites_user_ad", columnNames = {"user_id", "advertisement_id"})
})
@Getter
@Setter
public class Favorite extends BaseEntity {

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "advertisement_id", nullable = false, length = 36)
    private String advertisementId;
}

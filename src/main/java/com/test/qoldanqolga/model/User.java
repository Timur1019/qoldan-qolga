package com.test.qoldanqolga.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {

    @Column(unique = true, length = 255)
    private String email;

    @Column(length = 255)
    @JsonIgnore
    private String passwordHash;

    @Column(unique = true, length = 20)
    private String phone;

    @Column(name = "phone_verified_at")
    private Instant phoneVerifiedAt;

    @Column(nullable = false, length = 100)
    private String displayName;

    @Column(length = 512)
    private String avatar;

    @Column(length = 2048)
    private String avatarPhotos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @Column(name = "profile_verified", nullable = false)
    private Boolean profileVerified = false;

    @Column(name = "store_verified", nullable = false)
    private Boolean storeVerified = false;

    @Column(name = "banned_until")
    private Instant bannedUntil;

    @Column(name = "ban_reason", length = 500)
    private String banReason;

    @Column(name = "verification_requested_at")
    private Instant verificationRequestedAt;

    @Column(name = "myid_session_id", length = 64)
    private String myidSessionId;

    @Column(name = "last_seen_at")
    private Instant lastSeenAt;

    /** Пользователь заблокирован: есть дата окончания бана в будущем. */
    public boolean isCurrentlyBanned() {
        return bannedUntil != null && bannedUntil.isAfter(Instant.now());
    }
}

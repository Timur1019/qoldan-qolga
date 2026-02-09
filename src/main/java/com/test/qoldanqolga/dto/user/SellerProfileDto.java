package com.test.qoldanqolga.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SellerProfileDto {
    private String id;
    private String displayName;
    private String avatar;
    private Instant createdAt;
    private long adsCount;
    private long subscribersCount;
    private Boolean subscribed; // null if not authenticated, true/false otherwise
}

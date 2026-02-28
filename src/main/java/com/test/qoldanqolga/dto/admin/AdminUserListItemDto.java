package com.test.qoldanqolga.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserListItemDto {

    private String id;
    private String email;
    private String displayName;
    private String role;
    private Boolean profileVerified;
    private Instant verificationRequestedAt;
    private Instant bannedUntil;
    private String banReason;
}

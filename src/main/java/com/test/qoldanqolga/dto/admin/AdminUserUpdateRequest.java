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
public class AdminUserUpdateRequest {

    private Boolean profileVerified;
    private String role;
    private Instant bannedUntil;
    private String banReason;
}

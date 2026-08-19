package com.test.qoldanqolga.dto.admin;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
public class AdminAdStatItemDto {

    private String id;
    private String title;
    private String category;
    private String status;
    private String userId;
    private String userDisplayName;
    private Instant createdAt;
}

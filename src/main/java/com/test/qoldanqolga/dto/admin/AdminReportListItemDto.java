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
public class AdminReportListItemDto {

    private String id;
    private String adId;
    private String adTitle;
    private String ownerId;
    private String ownerDisplayName;
    private String reporterId;
    private String reporterDisplayName;
    private String reason;
    private String comment;
    private Instant createdAt;
    private Instant sellerNotifiedAt;
}

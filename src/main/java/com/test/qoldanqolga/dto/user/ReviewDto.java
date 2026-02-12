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
public class ReviewDto {
    private String id;
    private String authorId;
    private String authorDisplayName;
    private String targetUserId;
    private String targetDisplayName;
    private String adId;
    private Integer rating;
    private String text;
    private Instant createdAt;
}

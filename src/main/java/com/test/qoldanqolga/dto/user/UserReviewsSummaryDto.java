package com.test.qoldanqolga.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserReviewsSummaryDto {
    private double averageRating;
    private long totalCount;
    private Map<Integer, Long> ratingCounts; // 5->3, 4->1, etc.
    private List<ReviewDto> reviews;
}

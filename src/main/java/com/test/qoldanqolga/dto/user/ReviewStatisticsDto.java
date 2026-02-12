package com.test.qoldanqolga.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Результат агрегирующего запроса по отзывам пользователя.
 * Используется в JPQL constructor expression.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewStatisticsDto {

    private double averageRating;
    private long totalCount;
    private long rating5;
    private long rating4;
    private long rating3;
    private long rating2;
    private long rating1;
}

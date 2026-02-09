package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.user.CreateReviewRequest;
import com.test.qoldanqolga.dto.user.ReviewDto;
import com.test.qoldanqolga.dto.user.UserReviewsSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {

    ReviewDto create(String targetUserId, CreateReviewRequest request, String authorId);

    UserReviewsSummaryDto getReviewsSummary(String targetUserId, Pageable pageable);

    Page<ReviewDto> getReviews(String targetUserId, Pageable pageable);

    /** Отзывы, которые оставил данный пользователь (автор). */
    Page<ReviewDto> getReviewsByAuthor(String authorId, Pageable pageable);
}

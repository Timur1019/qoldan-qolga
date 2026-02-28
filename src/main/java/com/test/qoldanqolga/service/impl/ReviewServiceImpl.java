package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.constant.RatingConstants;
import com.test.qoldanqolga.dto.user.CreateReviewRequest;
import com.test.qoldanqolga.dto.user.ReviewDto;
import com.test.qoldanqolga.dto.user.ReviewStatisticsDto;
import com.test.qoldanqolga.dto.user.UserReviewsSummaryDto;
import com.test.qoldanqolga.exception.ConflictException;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.exception.SelfReviewException;
import com.test.qoldanqolga.mapper.ReviewMapper;
import com.test.qoldanqolga.model.Review;
import com.test.qoldanqolga.repository.ReviewRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.ReviewService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ReviewMapper reviewMapper;

    @Override
    @Transactional
    public ReviewDto create(String targetUserId, CreateReviewRequest request, String authorId) {
        if (authorId.equals(targetUserId)) {
            throw new SelfReviewException(authorId);
        }
        if (!userRepository.existsById(targetUserId)) {
            throw new ResourceNotFoundException("Пользователь", targetUserId);
        }

        String adId = request.getAdId();
        if (reviewRepository.existsByAuthorAndTarget(authorId, targetUserId, adId)) {
            throw new ConflictException("Вы уже оставили отзыв этому продавцу");
        }

        Review review = new Review();
        review.setAuthorId(authorId);
        review.setTargetUserId(targetUserId);
        review.setAdId(adId);
        review.setRating(request.getRating());
        review.setText(request.getTextTrimmed());
        review = reviewRepository.save(review);
        LogUtil.info(ReviewServiceImpl.class, "Review created: id={} target={} author={}", review.getId(), targetUserId, authorId);

        return reviewRepository.findByIdWithUsers(review.getId())
                .map(reviewMapper::toDto)
                .orElse(reviewMapper.toDto(review));
    }

    @Override
    @Transactional(readOnly = true)
    public UserReviewsSummaryDto getReviewsSummary(String targetUserId, Pageable pageable) {
        ReviewStatisticsDto stats = reviewRepository.getStatistics(targetUserId);
        LogUtil.debug(ReviewServiceImpl.class, "Reviews summary: targetUserId={} total={}", targetUserId, stats != null ? stats.getTotalCount() : 0);
        if (stats == null) {
            return new UserReviewsSummaryDto(0, 0, defaultRatingCounts(), List.of());
        }

        Map<Integer, Long> ratingCounts = new LinkedHashMap<>();
        ratingCounts.put(5, stats.getRating5());
        ratingCounts.put(4, stats.getRating4());
        ratingCounts.put(3, stats.getRating3());
        ratingCounts.put(2, stats.getRating2());
        ratingCounts.put(1, stats.getRating1());

        Page<Review> page = reviewRepository.findByTargetUserIdWithUsers(targetUserId, pageable);
        return new UserReviewsSummaryDto(
                stats.getAverageRating(),
                stats.getTotalCount(),
                ratingCounts,
                reviewMapper.toDtoList(page.getContent())
        );
    }

    @Override
    public Page<ReviewDto> getReviews(String targetUserId, Pageable pageable) {
        Page<ReviewDto> page = reviewRepository.findByTargetUserIdWithUsers(targetUserId, pageable)
                .map(reviewMapper::toDto);
        LogUtil.debug(ReviewServiceImpl.class, "Get reviews: targetUserId={} total={}", targetUserId, page.getTotalElements());
        return page;
    }

    @Override
    public Page<ReviewDto> getReviewsByAuthor(String authorId, Pageable pageable) {
        Page<ReviewDto> page = reviewRepository.findByAuthorIdWithUsers(authorId, pageable)
                .map(reviewMapper::toDto);
        LogUtil.debug(ReviewServiceImpl.class, "Get reviews by author: authorId={} total={}", authorId, page.getTotalElements());
        return page;
    }

    private static Map<Integer, Long> defaultRatingCounts() {
        Map<Integer, Long> m = new LinkedHashMap<>();
        for (int i = RatingConstants.MAX_RATING; i >= RatingConstants.MIN_RATING; i--) {
            m.put(i, 0L);
        }
        return m;
    }

}

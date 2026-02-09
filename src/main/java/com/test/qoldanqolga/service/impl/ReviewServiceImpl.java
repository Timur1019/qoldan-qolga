package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.user.CreateReviewRequest;
import com.test.qoldanqolga.dto.user.ReviewDto;
import com.test.qoldanqolga.dto.user.UserReviewsSummaryDto;
import com.test.qoldanqolga.exception.ConflictException;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.Review;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.ReviewRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReviewDto create(String targetUserId, CreateReviewRequest request, String authorId) {
        if (authorId.equals(targetUserId)) {
            throw new IllegalArgumentException("Нельзя оставить отзыв самому себе");
        }
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", targetUserId));

        Long adId = request.getAdId();
        boolean alreadyReviewed = adId != null
                ? reviewRepository.existsByAuthorIdAndTargetUserIdAndAdId(authorId, targetUserId, adId)
                : reviewRepository.existsByAuthorIdAndTargetUserId(authorId, targetUserId);
        if (alreadyReviewed) {
            throw new ConflictException("Вы уже оставили отзыв этому продавцу");
        }

        Review review = new Review();
        review.setAuthorId(authorId);
        review.setTargetUserId(targetUserId);
        review.setAdId(adId);
        review.setRating(request.getRating());
        review.setText(request.getText() != null ? request.getText().trim() : null);

        review = reviewRepository.save(review);
        return toDto(review);
    }

    @Override
    @Transactional(readOnly = true)
    public UserReviewsSummaryDto getReviewsSummary(String targetUserId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByTargetUserIdOrderByCreatedAtDesc(targetUserId, pageable);
        List<Object[]> counts = reviewRepository.countByRatingForUser(targetUserId);

        Map<Integer, Long> ratingCounts = new HashMap<>();
        for (int i = 5; i >= 1; i--) {
            ratingCounts.put(i, 0L);
        }
        long total = 0;
        double sum = 0;
        for (Object[] row : counts) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingCounts.put(rating, count);
            total += count;
            sum += rating * count;
        }

        double average = total > 0 ? sum / total : 0;

        List<ReviewDto> reviews = page.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return new UserReviewsSummaryDto(average, total, ratingCounts, reviews);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDto> getReviews(String targetUserId, Pageable pageable) {
        return reviewRepository.findByTargetUserIdOrderByCreatedAtDesc(targetUserId, pageable)
                .map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewDto> getReviewsByAuthor(String authorId, Pageable pageable) {
        return reviewRepository.findByAuthorIdOrderByCreatedAtDesc(authorId, pageable)
                .map(this::toDto);
    }

    private ReviewDto toDto(Review r) {
        ReviewDto dto = new ReviewDto();
        dto.setId(r.getId());
        dto.setAuthorId(r.getAuthorId());
        dto.setAuthorDisplayName(r.getAuthor() != null ? r.getAuthor().getDisplayName() : null);
        dto.setTargetUserId(r.getTargetUserId());
        dto.setTargetDisplayName(r.getTargetUser() != null ? r.getTargetUser().getDisplayName() : null);
        dto.setAdId(r.getAdId());
        dto.setRating(r.getRating());
        dto.setText(r.getText());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}

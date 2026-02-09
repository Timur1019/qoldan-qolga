package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.user.CreateReviewRequest;
import com.test.qoldanqolga.dto.user.ReviewDto;
import com.test.qoldanqolga.dto.user.SellerProfileDto;
import com.test.qoldanqolga.dto.user.UserReviewsSummaryDto;
import com.test.qoldanqolga.service.ReviewService;
import com.test.qoldanqolga.service.UserSubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserSubscriptionService subscriptionService;
    private final ReviewService reviewService;

    @GetMapping("/{id}")
    public ResponseEntity<SellerProfileDto> getSellerProfile(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        String currentUserId = user != null ? user.getUsername() : null;
        return ResponseEntity.ok(subscriptionService.getSellerProfile(id, currentUserId));
    }

    @GetMapping("/{id}/ads")
    public ResponseEntity<Page<AdListItemDto>> getSellerAds(
            @PathVariable String id,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails user
    ) {
        String currentUserId = user != null ? user.getUsername() : null;
        return ResponseEntity.ok(subscriptionService.getSellerAds(id, pageable, currentUserId));
    }

    @PostMapping("/{id}/subscribe")
    public ResponseEntity<Void> subscribe(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        subscriptionService.subscribe(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/subscribe")
    public ResponseEntity<Void> unsubscribe(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        subscriptionService.unsubscribe(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/subscribe/toggle")
    public ResponseEntity<Boolean> toggleSubscribe(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        boolean subscribed = subscriptionService.toggle(user.getUsername(), id);
        return ResponseEntity.ok(subscribed);
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<UserReviewsSummaryDto> getReviews(
            @PathVariable String id,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(reviewService.getReviewsSummary(id, pageable));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewDto> createReview(
            @PathVariable String id,
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        ReviewDto created = reviewService.create(id, request, user.getUsername());
        return ResponseEntity.ok(created);
    }
}

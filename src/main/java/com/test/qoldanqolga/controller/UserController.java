package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.user.CreateReviewRequest;
import com.test.qoldanqolga.dto.user.ReviewDto;
import com.test.qoldanqolga.dto.user.SellerProfileDto;
import com.test.qoldanqolga.dto.user.UserReviewsSummaryDto;
import com.test.qoldanqolga.service.ReviewService;
import com.test.qoldanqolga.service.SellerProfileService;
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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Пользователи", description = "Профили продавцов, подписки, отзывы")
@RequiredArgsConstructor
public class UserController {

    private final SellerProfileService sellerProfileService;
    private final UserSubscriptionService subscriptionService;
    private final ReviewService reviewService;

    @Operation(summary = "Мои подписки", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    @GetMapping("/me/subscriptions")
    public ResponseEntity<List<SellerProfileDto>> getMySubscriptions(
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(sellerProfileService.getMySubscriptions(user.getUsername()));
    }

    @Operation(summary = "Профиль продавца")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/{id}")
    public ResponseEntity<SellerProfileDto> getSellerProfile(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        String currentUserId = user != null ? user.getUsername() : null;
        return ResponseEntity.ok(sellerProfileService.getSellerProfile(id, currentUserId));
    }

    @Operation(summary = "Объявления продавца")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/{id}/ads")
    public ResponseEntity<Page<AdListItemDto>> getSellerAds(
            @PathVariable String id,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails user
    ) {
        String currentUserId = user != null ? user.getUsername() : null;
        return ResponseEntity.ok(sellerProfileService.getSellerAds(id, pageable, currentUserId));
    }

    @Operation(summary = "Подписаться", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
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

    @Operation(summary = "Отписаться", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
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

    @Operation(summary = "Переключить подписку", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
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

    @Operation(summary = "Отзывы пользователя")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/{id}/reviews")
    public ResponseEntity<UserReviewsSummaryDto> getReviews(
            @PathVariable String id,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return ResponseEntity.ok(reviewService.getReviewsSummary(id, pageable));
    }

    @Operation(summary = "Оставить отзыв", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
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

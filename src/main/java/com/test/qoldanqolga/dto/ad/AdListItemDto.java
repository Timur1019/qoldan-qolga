package com.test.qoldanqolga.dto.ad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdListItemDto {
    private String id;
    private String title;
    private BigDecimal price;
    private String currency;
    private String category;
    private String region;
    private String description;
    private String status;
    private Boolean isNegotiable;
    private String mainImageUrl;
    /** Все URL фото по порядку (для галереи в карточке списка). */
    private List<String> imageUrls;
    private Instant createdAt;
    private Boolean favorite;
    /** Для карточки с продавцом: userId, displayName, avatar, phone, рейтинг */
    private String userId;
    private String userDisplayName;
    private String userAvatar;
    private String phone;
    private Double averageRating;
    private Long totalReviews;
}

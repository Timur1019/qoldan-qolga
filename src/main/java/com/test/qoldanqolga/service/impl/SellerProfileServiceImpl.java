package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.user.SellerProfileDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.repository.UserSubscriptionRepository;
import com.test.qoldanqolga.service.AdvertisementService;
import com.test.qoldanqolga.service.SellerProfileService;
import com.test.qoldanqolga.service.UserSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Профиль продавца: данные пользователя, счётчики, объявления.
 * Отдельная ответственность от подписок.
 */
@Service
@RequiredArgsConstructor
public class SellerProfileServiceImpl implements SellerProfileService {

    private final UserRepository userRepository;
    private final AdvertisementService advertisementService;
    private final UserSubscriptionRepository subscriptionRepository;
    private final UserSubscriptionService subscriptionService;

    @Override
    public SellerProfileDto getSellerProfile(String sellerId, String currentUserId) {
        User user = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", sellerId));
        if (user.isDeleted()) {
            throw new ResourceNotFoundException("Пользователь", sellerId);
        }

        long adsCount = advertisementService.countByUser(sellerId);
        long subscribersCount = subscriptionRepository.countBySubscribedToId(sellerId);

        boolean subscribed = false;
        if (currentUserId != null && !currentUserId.equals(sellerId)) {
            subscribed = subscriptionService.isSubscribed(currentUserId, sellerId);
        }

        SellerProfileDto dto = new SellerProfileDto();
        dto.setId(user.getId());
        dto.setDisplayName(user.getDisplayName());
        dto.setAvatar(user.getAvatar());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setAdsCount(adsCount);
        dto.setSubscribersCount(subscribersCount);
        dto.setSubscribed(subscribed);
        return dto;
    }

    @Override
    public Page<AdListItemDto> getSellerAds(String sellerId, Pageable pageable, String currentUserId) {
        return advertisementService.listByUser(sellerId, pageable, currentUserId);
    }
}

package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.user.SellerProfileDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.model.UserSubscription;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.repository.UserSubscriptionRepository;
import com.test.qoldanqolga.service.AdvertisementService;
import com.test.qoldanqolga.service.UserSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserSubscriptionServiceImpl implements UserSubscriptionService {

    private final UserSubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final AdvertisementService advertisementService;

    @Override
    @Transactional(readOnly = true)
    public SellerProfileDto getSellerProfile(String sellerId, String currentUserId) {
        User user = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь", sellerId));
        if (user.isDeleted()) {
            throw new ResourceNotFoundException("Пользователь", sellerId);
        }
        long adsCount = advertisementService.countByUser(sellerId);
        long subscribersCount = subscriptionRepository.countBySubscribedToId(sellerId);
        Boolean subscribed = currentUserId != null && !currentUserId.equals(sellerId)
                ? subscriptionRepository.existsBySubscriberIdAndSubscribedToId(currentUserId, sellerId)
                : null;
        return new SellerProfileDto(
                user.getId(),
                user.getDisplayName(),
                user.getAvatar(),
                user.getCreatedAt(),
                adsCount,
                subscribersCount,
                subscribed
        );
    }

    @Override
    @Transactional
    public void subscribe(String subscriberId, String subscribedToId) {
        if (subscriberId.equals(subscribedToId)) return;
        if (!userRepository.existsById(subscribedToId)) {
            throw new ResourceNotFoundException("Пользователь", subscribedToId);
        }
        if (subscriptionRepository.existsBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId)) return;
        UserSubscription sub = new UserSubscription();
        sub.setSubscriberId(subscriberId);
        sub.setSubscribedToId(subscribedToId);
        subscriptionRepository.save(sub);
    }

    @Override
    @Transactional
    public void unsubscribe(String subscriberId, String subscribedToId) {
        subscriptionRepository.deleteBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId);
    }

    @Override
    @Transactional
    public boolean toggle(String subscriberId, String subscribedToId) {
        if (subscriberId.equals(subscribedToId)) return false;
        boolean exists = subscriptionRepository.existsBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId);
        if (exists) {
            subscriptionRepository.deleteBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId);
            return false;
        }
        subscribe(subscriberId, subscribedToId);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSubscribed(String subscriberId, String subscribedToId) {
        return subscriberId != null && subscriptionRepository.existsBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdListItemDto> getSellerAds(String sellerId, Pageable pageable, String currentUserId) {
        return advertisementService.listByUser(sellerId, pageable, currentUserId);
    }
}

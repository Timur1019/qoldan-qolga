package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.user.SellerProfileDto;
import org.springframework.data.domain.Page;
import com.test.qoldanqolga.dto.ad.AdListItemDto;

public interface UserSubscriptionService {

    SellerProfileDto getSellerProfile(String sellerId, String currentUserId);

    void subscribe(String subscriberId, String subscribedToId);

    void unsubscribe(String subscriberId, String subscribedToId);

    boolean toggle(String subscriberId, String subscribedToId);

    boolean isSubscribed(String subscriberId, String subscribedToId);

    Page<AdListItemDto> getSellerAds(String sellerId, org.springframework.data.domain.Pageable pageable, String currentUserId);
}

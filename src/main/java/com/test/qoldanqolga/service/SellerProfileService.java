package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.user.SellerProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Профиль продавца и его объявления.
 */
public interface SellerProfileService {

    SellerProfileDto getSellerProfile(String sellerId, String currentUserId);

    Page<AdListItemDto> getSellerAds(String sellerId, Pageable pageable, String currentUserId);

    /** Профили продавцов, на которых подписан текущий пользователь. */
    List<SellerProfileDto> getMySubscriptions(String currentUserId);
}

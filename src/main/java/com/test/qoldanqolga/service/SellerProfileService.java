package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.user.SellerProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Профиль продавца и его объявления.
 */
public interface SellerProfileService {

    SellerProfileDto getSellerProfile(String sellerId, String currentUserId);

    Page<AdListItemDto> getSellerAds(String sellerId, Pageable pageable, String currentUserId);
}

package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface FavoriteService {

    /** Add ad to user's favorites. Idempotent. */
    void add(String userId, Long advertisementId);

    /** Remove ad from user's favorites. Idempotent. */
    void remove(String userId, Long advertisementId);

    /** Remove all favorites for an advertisement (e.g. when ad is deleted). */
    void removeAllByAdvertisementId(Long advertisementId);

    /** Toggle: add if not present, remove if present. Returns new state (true = in favorites). */
    boolean toggle(String userId, Long advertisementId);

    boolean isFavorite(String userId, Long advertisementId);

    Set<Long> getFavoriteAdIds(String userId);

    Page<AdListItemDto> getFavoriteAds(String userId, Pageable pageable);
}

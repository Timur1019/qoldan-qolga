package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface FavoriteService {

    /** Add ad to user's favorites. Idempotent. */
    void add(String userId, String advertisementId);

    /** Remove ad from user's favorites. Idempotent. */
    void remove(String userId, String advertisementId);

    /** Remove all favorites for an advertisement (e.g. when ad is deleted). */
    void removeAllByAdvertisementId(String advertisementId);

    /** Toggle: add if not present, remove if present. Returns new state (true = in favorites). */
    boolean toggle(String userId, String advertisementId);

    boolean isFavorite(String userId, String advertisementId);

    Set<String> getFavoriteAdIds(String userId);

    Page<AdListItemDto> getFavoriteAds(String userId, Pageable pageable);
}

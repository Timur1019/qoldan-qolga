package com.test.qoldanqolga.service.component;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Сборка AdDetailDto.
 */
@Component
@RequiredArgsConstructor
public class AdDetailDtoBuilder {

    private final AdvertisementMapper advertisementMapper;
    private final FavoriteService favoriteService;

    public AdDetailDto build(Advertisement ad, String currentUserId) {
        AdDetailDto dto = advertisementMapper.toDetailDto(ad);
        dto.setUserId(ad.getUserId());
        dto.setFavorite(favoriteService.isFavorite(currentUserId, ad.getId()));
        return dto;
    }
}

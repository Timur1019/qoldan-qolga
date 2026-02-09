package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdImageDto;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.model.AdImage;
import com.test.qoldanqolga.model.Advertisement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AdvertisementMapper {

    @Mapping(target = "mainImageUrl", ignore = true)
    @Mapping(target = "favorite", ignore = true)
    AdListItemDto toListItemDto(Advertisement ad);

    @Mapping(target = "userDisplayName", expression = "java(userDisplayName(ad))")
    @Mapping(target = "favorite", ignore = true)
    AdDetailDto toDetailDto(Advertisement ad);

    AdImageDto toImageDto(AdImage image);

    List<AdImageDto> toImageDtoList(List<AdImage> images);

    default String userDisplayName(Advertisement ad) {
        return ad.getUser() != null ? ad.getUser().getDisplayName() : null;
    }

    /**
     * Единое место получения URL главного изображения объявления.
     * Используется в AdvertisementService и FavoriteService (DRY).
     */
    default String getMainImageUrl(Advertisement ad) {
        if (ad.getImages() == null || ad.getImages().isEmpty()) {
            return null;
        }
        return ad.getImages().stream()
                .filter(AdImage::getIsMain)
                .findFirst()
                .map(AdImage::getUrl)
                .orElse(ad.getImages().get(0).getUrl());
    }
}

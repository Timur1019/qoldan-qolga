package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdImageDto;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.model.AdImage;
import com.test.qoldanqolga.model.Advertisement;
import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface AdvertisementMapper extends BaseMapper<Advertisement, AdListItemDto> {

    @Override
    @Mapping(target = "mainImageUrl", ignore = true)
    @Mapping(target = "imageUrls", ignore = true)
    @Mapping(target = "favorite", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "userDisplayName", ignore = true)
    @Mapping(target = "userAvatar", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    AdListItemDto toDto(Advertisement ad);

    /** Альias для toDto — сохраняет обратную совместимость. */
    default AdListItemDto toListItemDto(Advertisement ad) {
        return toDto(ad);
    }

    @Mapping(target = "userDisplayName", expression = "java(userDisplayName(ad))")
    @Mapping(target = "favorite", ignore = true)
    AdDetailDto toDetailDto(Advertisement ad);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "views", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", constant = AdConstants.STATUS_ACTIVE)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "title", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trim(request.getTitle()))")
    @Mapping(target = "description", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trim(request.getDescription()))")
    @Mapping(target = "phone", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trim(request.getPhone()))")
    @Mapping(target = "email", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trimOrNull(request.getEmail()))")
    @Mapping(target = "region", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trimOrNull(request.getRegion()))")
    @Mapping(target = "district", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trimOrNull(request.getDistrict()))")
    @Mapping(target = "currency", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.defaultCurrency(request.getCurrency()))")
    @Mapping(target = "category", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.defaultCategory(request.getCategory()))")
    @Mapping(target = "sellerType", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.nonBlankOrNull(request.getSellerType()))")
    @Mapping(target = "isNegotiable", expression = "java(Boolean.TRUE.equals(request.getIsNegotiable()))")
    @Mapping(target = "canDeliver", expression = "java(Boolean.TRUE.equals(request.getCanDeliver()))")
    @Mapping(target = "hasLicense", expression = "java(Boolean.TRUE.equals(request.getHasLicense()))")
    @Mapping(target = "worksByContract", expression = "java(Boolean.TRUE.equals(request.getWorksByContract()))")
    @Mapping(target = "urgentBargain", expression = "java(Boolean.TRUE.equals(request.getUrgentBargain()))")
    @Mapping(target = "giveAway", expression = "java(Boolean.TRUE.equals(request.getGiveAway()))")
    Advertisement toEntity(CreateAdRequest request, @Context String userId);

    @AfterMapping
    default void setUserId(@MappingTarget Advertisement ad, @Context String userId) {
        if (userId != null) ad.setUserId(userId);
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "views", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "title", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trim(request.getTitle()))")
    @Mapping(target = "description", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trim(request.getDescription()))")
    @Mapping(target = "phone", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trim(request.getPhone()))")
    @Mapping(target = "email", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trimOrNull(request.getEmail()))")
    @Mapping(target = "region", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trimOrNull(request.getRegion()))")
    @Mapping(target = "district", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.trimOrNull(request.getDistrict()))")
    @Mapping(target = "currency", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.defaultCurrency(request.getCurrency()))")
    @Mapping(target = "category", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.defaultCategory(request.getCategory()))")
    @Mapping(target = "sellerType", expression = "java(com.test.qoldanqolga.util.CreateAdMapperHelper.nonBlankOrNull(request.getSellerType()))")
    @Mapping(target = "isNegotiable", expression = "java(Boolean.TRUE.equals(request.getIsNegotiable()))")
    @Mapping(target = "canDeliver", expression = "java(Boolean.TRUE.equals(request.getCanDeliver()))")
    @Mapping(target = "hasLicense", expression = "java(Boolean.TRUE.equals(request.getHasLicense()))")
    @Mapping(target = "worksByContract", expression = "java(Boolean.TRUE.equals(request.getWorksByContract()))")
    @Mapping(target = "urgentBargain", expression = "java(Boolean.TRUE.equals(request.getUrgentBargain()))")
    @Mapping(target = "giveAway", expression = "java(Boolean.TRUE.equals(request.getGiveAway()))")
    void updateEntity(CreateAdRequest request, @MappingTarget Advertisement ad);

    /**
     * Создаёт список AdImage из imageUrls запроса.
     */
    default List<AdImage> toImageList(CreateAdRequest request, String adId, Advertisement ad) {
        if (request.getImageUrls() == null || request.getImageUrls().isEmpty()) {
            return new ArrayList<>();
        }
        List<AdImage> result = new ArrayList<>();
        int order = 0;
        for (String url : request.getImageUrls()) {
            if (url == null || url.isBlank()) continue;
            AdImage img = new AdImage();
            img.setAdId(adId);
            img.setAd(ad);
            img.setUrl(url.trim());
            img.setIsMain(order == 0);
            img.setOrderNum(order++);
            result.add(img);
        }
        return result;
    }

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

package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.AdImage;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.repository.AdImageRepository;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.service.AdvertisementService;
import com.test.qoldanqolga.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdvertisementServiceImpl implements AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final AdImageRepository adImageRepository;
    private final AdvertisementMapper mapper;
    private final FavoriteService favoriteService;

    @Override
    @Transactional(readOnly = true)
    public Page<AdListItemDto> list(String status, String category, String region, String currentUserId, Pageable pageable) {
        String s = status != null && !status.isBlank() ? status : "ACTIVE";
        String cat = (category != null && !category.isBlank()) ? category : null;
        String reg = (region != null && !region.isBlank()) ? region : null;
        var favoriteIds = currentUserId != null ? favoriteService.getFavoriteAdIds(currentUserId) : Set.<Long>of();
        return advertisementRepository.findByStatusAndCategoryAndRegionOrderByCreatedAtDesc(s, cat, reg, pageable)
                .map(ad -> {
                    AdListItemDto dto = mapper.toListItemDto(ad);
                    dto.setMainImageUrl(getMainImageUrl(ad));
                    dto.setFavorite(favoriteIds.contains(ad.getId()));
                    return dto;
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdListItemDto> listByUser(String userId, Pageable pageable) {
        return advertisementRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(ad -> {
                    AdListItemDto dto = mapper.toListItemDto(ad);
                    dto.setMainImageUrl(getMainImageUrl(ad));
                    return dto;
                });
    }

    @Override
    @Transactional
    public AdDetailDto getById(Long id, String currentUserId) {
        Advertisement ad = advertisementRepository.findByIdWithUserAndImages(id)
                .orElseThrow(() -> new IllegalArgumentException("Объявление не найдено"));
        advertisementRepository.incrementViews(id);
        ad.setViews(ad.getViews() + 1);
        AdDetailDto dto = mapper.toDetailDto(ad);
        dto.setFavorite(favoriteService.isFavorite(currentUserId, id));
        return dto;
    }

    @Override
    @Transactional
    public AdDetailDto create(CreateAdRequest request, String userId) {
        Advertisement ad = new Advertisement();
        ad.setTitle(request.getTitle().trim());
        ad.setDescription(request.getDescription().trim());
        ad.setPrice(request.getPrice());
        ad.setCurrency(request.getCurrency() != null ? request.getCurrency() : "UZS");
        ad.setCategory(request.getCategory() != null ? request.getCategory() : "Xizmatlar");
        ad.setPhone(request.getPhone().trim());
        ad.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        ad.setRegion(request.getRegion() != null ? request.getRegion().trim() : null);
        ad.setDistrict(request.getDistrict() != null ? request.getDistrict().trim() : null);
        ad.setStatus("ACTIVE");
        ad.setIsNegotiable(Boolean.TRUE.equals(request.getIsNegotiable()));
        ad.setUserId(userId);
        ad.setExpiresAt(request.getExpiresAt());
        ad = advertisementRepository.save(ad);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<AdImage> images = new ArrayList<>();
            int order = 0;
            for (String url : request.getImageUrls()) {
                if (url == null || url.isBlank()) continue;
                AdImage img = new AdImage();
                img.setAdId(ad.getId());
                img.setUrl(url.trim());
                img.setIsMain(order == 0);
                img.setOrderNum(order++);
                images.add(adImageRepository.save(img));
            }
            ad.getImages().addAll(images);
        }

        return mapper.toDetailDto(ad);
    }

    private static String getMainImageUrl(Advertisement ad) {
        if (ad.getImages() == null || ad.getImages().isEmpty()) return null;
        return ad.getImages().stream()
                .filter(AdImage::getIsMain)
                .findFirst()
                .map(AdImage::getUrl)
                .orElse(ad.getImages().get(0).getUrl());
    }
}

package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.AdImage;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.repository.AdImageRepository;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.service.AdvertisementService;
import com.test.qoldanqolga.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
    @Cacheable(value = "adsList", key = "#status + '-' + (#category != null ? #category : '') + '-' + (#region != null ? #region : '') + '-' + #pageable.pageNumber + '-' + #pageable.pageSize", condition = "#currentUserId == null")
    public Page<AdListItemDto> list(String status, String category, String region, String currentUserId, Pageable pageable) {
        String s = status != null && !status.isBlank() ? status : AdConstants.STATUS_ACTIVE;
        String cat = (category != null && !category.isBlank()) ? category : null;
        String reg = (region != null && !region.isBlank()) ? region : null;
        var favoriteIds = currentUserId != null ? favoriteService.getFavoriteAdIds(currentUserId) : Set.<Long>of();
        return advertisementRepository.findByStatusAndCategoryAndRegionOrderByCreatedAtDesc(s, cat, reg, pageable)
                .map(ad -> {
                    AdListItemDto dto = mapper.toListItemDto(ad);
                    dto.setMainImageUrl(mapper.getMainImageUrl(ad));
                    dto.setFavorite(favoriteIds.contains(ad.getId()));
                    return dto;
                });
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUser(String userId) {
        return advertisementRepository.countByUserIdAndStatus(userId, AdConstants.STATUS_ACTIVE);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdListItemDto> listByUser(String userId, Pageable pageable) {
        return listByUser(userId, pageable, null);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdListItemDto> listByUser(String userId, Pageable pageable, String currentUserId) {
        var favoriteIds = currentUserId != null ? favoriteService.getFavoriteAdIds(currentUserId) : Set.<Long>of();
        return advertisementRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(ad -> {
                    AdListItemDto dto = mapper.toListItemDto(ad);
                    dto.setMainImageUrl(mapper.getMainImageUrl(ad));
                    dto.setFavorite(favoriteIds.contains(ad.getId()));
                    return dto;
                });
    }

    @Override
    @Transactional(readOnly = true)
    public AdDetailDto getById(Long id, String currentUserId) {
        Advertisement ad = advertisementRepository.findByIdWithUserAndImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        AdDetailDto dto = mapper.toDetailDto(ad);
        dto.setUserId(ad.getUserId());
        dto.setFavorite(favoriteService.isFavorite(currentUserId, id));
        return dto;
    }

    @Override
    @Transactional
    public void recordView(Long id) {
        if (advertisementRepository.existsById(id)) {
            advertisementRepository.incrementViews(id);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public AdDetailDto create(CreateAdRequest request, String userId) {
        Advertisement ad = new Advertisement();
        ad.setTitle(request.getTitle().trim());
        ad.setDescription(request.getDescription().trim());
        ad.setPrice(request.getPrice());
        ad.setCurrency(request.getCurrency() != null ? request.getCurrency() : AdConstants.CURRENCY_DEFAULT);
        ad.setCategory(request.getCategory() != null ? request.getCategory() : AdConstants.CATEGORY_DEFAULT);
        ad.setPhone(request.getPhone().trim());
        ad.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        ad.setRegion(request.getRegion() != null ? request.getRegion().trim() : null);
        ad.setDistrict(request.getDistrict() != null ? request.getDistrict().trim() : null);
        ad.setStatus(AdConstants.STATUS_ACTIVE);
        ad.setIsNegotiable(Boolean.TRUE.equals(request.getIsNegotiable()));
        ad.setCanDeliver(Boolean.TRUE.equals(request.getCanDeliver()));
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

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public AdDetailDto update(Long id, CreateAdRequest request, String userId) {
        Advertisement ad = advertisementRepository.findByIdWithUserAndImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        if (!ad.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Нет доступа к редактированию этого объявления");
        }
        ad.setTitle(request.getTitle().trim());
        ad.setDescription(request.getDescription().trim());
        ad.setPrice(request.getPrice());
        ad.setCurrency(request.getCurrency() != null ? request.getCurrency() : AdConstants.CURRENCY_DEFAULT);
        ad.setCategory(request.getCategory() != null ? request.getCategory() : AdConstants.CATEGORY_DEFAULT);
        ad.setPhone(request.getPhone().trim());
        ad.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        ad.setRegion(request.getRegion() != null ? request.getRegion().trim() : null);
        ad.setDistrict(request.getDistrict() != null ? request.getDistrict().trim() : null);
        ad.setIsNegotiable(Boolean.TRUE.equals(request.getIsNegotiable()));
        ad.setCanDeliver(Boolean.TRUE.equals(request.getCanDeliver()));
        ad.setExpiresAt(request.getExpiresAt());

        // Use orphanRemoval: clear first (deletes old images), then add new ones
        ad.getImages().clear();
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            int order = 0;
            for (String url : request.getImageUrls()) {
                if (url == null || url.isBlank()) continue;
                AdImage img = new AdImage();
                img.setAd(ad);
                img.setAdId(ad.getId());
                img.setUrl(url.trim());
                img.setIsMain(order == 0);
                img.setOrderNum(order++);
                ad.getImages().add(img);
            }
        }
        advertisementRepository.save(ad);

        return mapper.toDetailDto(ad);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public void delete(Long id, String userId) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        if (!ad.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Нет доступа к удалению этого объявления");
        }
        favoriteService.removeAllByAdvertisementId(id);
        advertisementRepository.delete(ad);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public void archive(Long id, String userId) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        if (!ad.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Нет доступа к закрытию этого объявления");
        }
        ad.setStatus(AdConstants.STATUS_ARCHIVED);
        advertisementRepository.save(ad);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public void restore(Long id, String userId) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        if (!ad.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Нет доступа к восстановлению этого объявления");
        }
        ad.setStatus(AdConstants.STATUS_ACTIVE);
        advertisementRepository.save(ad);
    }
}

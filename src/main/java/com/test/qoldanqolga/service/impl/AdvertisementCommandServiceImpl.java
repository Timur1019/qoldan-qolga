package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.service.AdvertisementCommandService;
import com.test.qoldanqolga.service.FavoriteService;
import com.test.qoldanqolga.service.component.AdImageService;
import com.test.qoldanqolga.service.component.AdPermissionService;
import com.test.qoldanqolga.service.validation.AdValidationService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdvertisementCommandServiceImpl implements AdvertisementCommandService {

    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementMapper advertisementMapper;
    private final AdImageService adImageService;
    private final AdPermissionService adPermissionService;
    private final AdValidationService adValidationService;
    private final FavoriteService favoriteService;

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public AdDetailDto create(CreateAdRequest request, String userId) {
        adValidationService.validateCreateOrUpdate(request);
        Advertisement ad = advertisementMapper.toEntity(request, userId);
        ad = advertisementRepository.save(ad);
        adImageService.saveImages(request, ad);
        LogUtil.info(AdvertisementCommandServiceImpl.class, "Ad created: id={} userId={}", ad.getId(), userId);
        return advertisementMapper.toDetailDto(ad);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public AdDetailDto update(String id, CreateAdRequest request, String userId) {
        adValidationService.validateCreateOrUpdate(request);
        Advertisement ad = advertisementRepository.findByIdWithUserAndImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        adPermissionService.validateOwnership(ad, userId);
        advertisementMapper.updateEntity(request, ad);
        adImageService.replaceImages(request, ad);
        advertisementRepository.save(ad);
        LogUtil.info(AdvertisementCommandServiceImpl.class, "Ad updated: id={} userId={}", id, userId);
        return advertisementMapper.toDetailDto(ad);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public void delete(String id, String userId) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        adPermissionService.validateOwnership(ad, userId);
        favoriteService.removeAllByAdvertisementId(id);
        advertisementRepository.delete(ad);
        LogUtil.info(AdvertisementCommandServiceImpl.class, "Ad deleted: id={} userId={}", id, userId);
    }
}

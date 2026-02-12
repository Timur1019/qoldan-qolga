package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.service.AdStatusService;
import com.test.qoldanqolga.service.component.AdPermissionService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdStatusServiceImpl implements AdStatusService {

    private final AdvertisementRepository advertisementRepository;
    private final AdPermissionService adPermissionService;

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public void archive(String id, String userId) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        adPermissionService.validateOwnership(ad, userId);
        ad.setStatus(AdConstants.STATUS_ARCHIVED);
        advertisementRepository.save(ad);
        LogUtil.info(AdStatusServiceImpl.class, "Ad archived: id={} userId={}", id, userId);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adsList", allEntries = true)
    public void restore(String id, String userId) {
        Advertisement ad = advertisementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        adPermissionService.validateOwnership(ad, userId);
        ad.setStatus(AdConstants.STATUS_ACTIVE);
        advertisementRepository.save(ad);
        LogUtil.info(AdStatusServiceImpl.class, "Ad restored: id={} userId={}", id, userId);
    }
}

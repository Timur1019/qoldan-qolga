package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.service.AdViewWriter;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdViewWriterImpl implements AdViewWriter {

    private final AdvertisementRepository advertisementRepository;

    @Override
    @Transactional
    public void increment(String adId) {
        if (adId == null || adId.isBlank()) {
            return;
        }
        int updated = advertisementRepository.incrementViews(adId);
        LogUtil.debug(AdViewWriterImpl.class, "View incremented: adId={} updated={}", adId, updated);
    }
}

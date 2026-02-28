package com.test.qoldanqolga.service.component;

import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.AdImage;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.repository.AdImageRepository;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Работа с изображениями объявлений.
 */
@Service
@RequiredArgsConstructor
public class AdImageService {

    private final AdImageRepository adImageRepository;
    private final AdvertisementMapper advertisementMapper;

    /**
     * Сохраняет изображения для нового объявления.
     */
    public void saveImages(CreateAdRequest request, Advertisement ad) {
        List<AdImage> images = advertisementMapper.toImageList(request, ad.getId(), ad);
        if (!images.isEmpty()) {
            adImageRepository.saveAll(images);
            ad.getImages().addAll(images);
            LogUtil.debug(AdImageService.class, "Saved {} images for ad {}", images.size(), ad.getId());
        }
    }

    /**
     * Заменяет изображения объявления (для update).
     */
    public void replaceImages(CreateAdRequest request, Advertisement ad) {
        ad.getImages().clear();
        List<AdImage> images = advertisementMapper.toImageList(request, ad.getId(), ad);
        ad.getImages().addAll(images);
        LogUtil.debug(AdImageService.class, "Replaced images for ad {}, count={}", ad.getId(), images.size());
    }
}

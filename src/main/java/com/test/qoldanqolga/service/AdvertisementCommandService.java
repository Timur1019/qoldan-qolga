package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;

/**
 * Сервис записи объявлений (create, update, delete).
 */
public interface AdvertisementCommandService {

    AdDetailDto create(CreateAdRequest request, String userId);

    AdDetailDto update(String id, CreateAdRequest request, String userId);

    void delete(String id, String userId);
}

package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdvertisementService {

    Page<AdListItemDto> list(String status, String category, String region, String currentUserId, Pageable pageable);

    Page<AdListItemDto> listByUser(String userId, Pageable pageable);

    Page<AdListItemDto> listByUser(String userId, Pageable pageable, String currentUserId);

    long countByUser(String userId);

    AdDetailDto getById(Long id, String currentUserId);

    void recordView(Long id);

    AdDetailDto create(CreateAdRequest request, String userId);

    AdDetailDto update(Long id, CreateAdRequest request, String userId);

    void delete(Long id, String userId);

    /** Закрыть объявление (перенести в архив). */
    void archive(Long id, String userId);

    /** Вывести объявление из архива (вернуть в активные). */
    void restore(Long id, String userId);
}

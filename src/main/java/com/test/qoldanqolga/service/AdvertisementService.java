package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListParams;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.pagination.CursorPageRequest;
import com.test.qoldanqolga.pagination.CursorPageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdvertisementService {

    /** Курсорная пагинация: выборка по id после курсора, ORDER BY id ASC. */
    CursorPageResponse<AdListItemDto> listByCursor(CursorPageRequest request, String status, String currentUserId);

    Page<AdListItemDto> list(AdListParams params, String currentUserId, Pageable pageable);

    Page<AdListItemDto> listByUser(String userId, Pageable pageable);

    Page<AdListItemDto> listByUser(String userId, Pageable pageable, String currentUserId);

    long countByUser(String userId);

    AdDetailDto getById(String id, String currentUserId);

    void recordView(String id);

    AdDetailDto create(CreateAdRequest request, String userId);

    AdDetailDto update(String id, CreateAdRequest request, String userId);

    void delete(String id, String userId);

    /** Закрыть объявление (перенести в архив). */
    void archive(String id, String userId);

    /** Вывести объявление из архива (вернуть в активные). */
    void restore(String id, String userId);
}

package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListParams;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.pagination.CursorPageRequest;
import com.test.qoldanqolga.pagination.CursorPageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Сервис чтения объявлений.
 */
public interface AdvertisementQueryService {

    CursorPageResponse<AdListItemDto> listByCursor(CursorPageRequest request, String status, String currentUserId);

    Page<AdListItemDto> list(AdListParams params, String currentUserId, Pageable pageable);

    Page<AdListItemDto> listByUser(String userId, Pageable pageable, String currentUserId);

    long countByUser(String userId);

    AdDetailDto getById(String id, String currentUserId);

    void recordView(String id);
}

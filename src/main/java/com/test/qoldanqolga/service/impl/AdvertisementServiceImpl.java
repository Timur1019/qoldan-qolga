package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListParams;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.pagination.CursorPageRequest;
import com.test.qoldanqolga.pagination.CursorPageResponse;
import com.test.qoldanqolga.service.AdStatusService;
import com.test.qoldanqolga.service.AdvertisementCommandService;
import com.test.qoldanqolga.service.AdvertisementQueryService;
import com.test.qoldanqolga.service.AdvertisementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Фасад объявлений: оркестрирует Query, Command и Status сервисы.
 */
@Service
@RequiredArgsConstructor
public class AdvertisementServiceImpl implements AdvertisementService {

    private final AdvertisementQueryService queryService;
    private final AdvertisementCommandService commandService;
    private final AdStatusService adStatusService;

    @Override
    public CursorPageResponse<AdListItemDto> listByCursor(CursorPageRequest request, String status, String currentUserId) {
        return queryService.listByCursor(request, status, currentUserId);
    }

    @Override
    public Page<AdListItemDto> list(AdListParams params, String currentUserId, Pageable pageable) {
        return queryService.list(params, currentUserId, pageable);
    }

    @Override
    public Page<AdListItemDto> listByUser(String userId, Pageable pageable) {
        return queryService.listByUser(userId, pageable, null);
    }

    @Override
    public Page<AdListItemDto> listByUser(String userId, Pageable pageable, String currentUserId) {
        return queryService.listByUser(userId, pageable, currentUserId);
    }

    @Override
    public long countByUser(String userId) {
        return queryService.countByUser(userId);
    }

    @Override
    public AdDetailDto getById(String id, String currentUserId) {
        return queryService.getById(id, currentUserId);
    }

    @Override
    public void recordView(String id) {
        queryService.recordView(id);
    }

    @Override
    public AdDetailDto create(CreateAdRequest request, String userId) {
        return commandService.create(request, userId);
    }

    @Override
    public AdDetailDto update(String id, CreateAdRequest request, String userId) {
        return commandService.update(id, request, userId);
    }

    @Override
    public void delete(String id, String userId) {
        commandService.delete(id, userId);
    }

    @Override
    public void archive(String id, String userId) {
        adStatusService.archive(id, userId);
    }

    @Override
    public void restore(String id, String userId) {
        adStatusService.restore(id, userId);
    }
}

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
import com.test.qoldanqolga.util.LogUtil;
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
        LogUtil.debug(AdvertisementServiceImpl.class, "List by cursor: status={} cursor={}", status, request.getCursor());
        return queryService.listByCursor(request, status, currentUserId);
    }

    @Override
    public Page<AdListItemDto> list(AdListParams params, String currentUserId, Pageable pageable) {
        LogUtil.debug(AdvertisementServiceImpl.class, "List ads: category={} region={}", params != null ? params.getCategory() : null, params != null ? params.getRegion() : null);
        return queryService.list(params, currentUserId, pageable);
    }

    @Override
    public Page<AdListItemDto> listByUser(String userId, Pageable pageable) {
        LogUtil.debug(AdvertisementServiceImpl.class, "List by user: userId={}", userId);
        return queryService.listByUser(userId, pageable, null);
    }

    @Override
    public Page<AdListItemDto> listByUser(String userId, Pageable pageable, String currentUserId) {
        LogUtil.debug(AdvertisementServiceImpl.class, "List by user: userId={} currentUserId={}", userId, currentUserId);
        return queryService.listByUser(userId, pageable, currentUserId);
    }

    @Override
    public long countByUser(String userId) {
        LogUtil.debug(AdvertisementServiceImpl.class, "Count by user: userId={}", userId);
        return queryService.countByUser(userId);
    }

    @Override
    public AdDetailDto getById(String id, String currentUserId) {
        LogUtil.debug(AdvertisementServiceImpl.class, "Ad detail requested: adId={} currentUserId={}", id, currentUserId);
        return queryService.getById(id, currentUserId);
    }

    @Override
    public void recordView(String id) {
        LogUtil.debug(AdvertisementServiceImpl.class, "Record view: adId={}", id);
        queryService.recordView(id);
    }

    @Override
    public AdDetailDto create(CreateAdRequest request, String userId) {
        LogUtil.info(AdvertisementServiceImpl.class, "Create ad: userId={}", userId);
        return commandService.create(request, userId);
    }

    @Override
    public AdDetailDto update(String id, CreateAdRequest request, String userId) {
        LogUtil.info(AdvertisementServiceImpl.class, "Update ad: adId={} userId={}", id, userId);
        return commandService.update(id, request, userId);
    }

    @Override
    public void delete(String id, String userId) {
        LogUtil.info(AdvertisementServiceImpl.class, "Delete ad: adId={} userId={}", id, userId);
        commandService.delete(id, userId);
    }

    @Override
    public void archive(String id, String userId) {
        LogUtil.info(AdvertisementServiceImpl.class, "Archive ad: adId={} userId={}", id, userId);
        adStatusService.archive(id, userId);
    }

    @Override
    public void restore(String id, String userId) {
        LogUtil.info(AdvertisementServiceImpl.class, "Restore ad: adId={} userId={}", id, userId);
        adStatusService.restore(id, userId);
    }
}

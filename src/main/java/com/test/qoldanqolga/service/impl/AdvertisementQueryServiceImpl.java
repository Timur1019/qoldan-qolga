package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListParams;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.pagination.CursorPageRequest;
import com.test.qoldanqolga.pagination.CursorPageResponse;
import com.test.qoldanqolga.pagination.PaginationUtils;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.AdvertisementSpecs;
import com.test.qoldanqolga.service.AdListQueryService;
import com.test.qoldanqolga.service.AdvertisementQueryService;
import com.test.qoldanqolga.service.component.AdDetailDtoBuilder;
import com.test.qoldanqolga.service.component.CategoryResolver;
import com.test.qoldanqolga.service.base.AbstractAdService;
import com.test.qoldanqolga.service.component.CursorPaginationProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdvertisementQueryServiceImpl extends AbstractAdService implements AdvertisementQueryService {

    private final AdvertisementRepository advertisementRepository;
    private final AdListQueryService adListQueryService;
    private final CategoryResolver categoryResolver;
    private final CursorPaginationProcessor cursorPaginationProcessor;
    private final AdDetailDtoBuilder adDetailDtoBuilder;

    @Override
    @Transactional(readOnly = true)
    public CursorPageResponse<AdListItemDto> listByCursor(
            CursorPageRequest request,
            String status,
            String currentUserId) {
        String s = getEffectiveStatus(status);
        int limit = PaginationUtils.normalizeLimit(request.getLimit());
        var pageable = PaginationUtils.createCursorPageable(limit);
        List<Advertisement> content = advertisementRepository.findByCursor(s, request.getCursor(), pageable);
        return cursorPaginationProcessor.process(
                content,
                limit,
                ads -> adListQueryService.buildListItems(ads, currentUserId, true),
                Advertisement::getId
        );
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "adsList", key = "#params.status + '-' + (#params.category != null ? #params.category : '') + '-' + (#params.region != null ? #params.region : '') + '-' + (#params.query != null ? #params.query : '') + '-' + #pageable.pageNumber + '-' + #pageable.pageSize", condition = "#currentUserId == null")
    public Page<AdListItemDto> list(AdListParams params, String currentUserId, Pageable pageable) {
        String s = getEffectiveStatus(params != null ? params.getStatus() : null);
        String cat = params != null && params.getCategory() != null && !params.getCategory().isBlank()
                ? params.getCategory() : null;
        List<String> categoryCodes = categoryResolver.resolveCategoryCodes(cat);
        Specification<Advertisement> spec = AdvertisementSpecs.withFilters(
                s,
                categoryCodes != null && categoryCodes.size() == 1 ? categoryCodes.get(0) : null,
                categoryCodes != null && categoryCodes.size() > 1 ? categoryCodes : null,
                params != null ? params.getRegion() : null,
                params != null ? params.getQuery() : null,
                params != null ? params.getSellerType() : null,
                params != null ? params.getHasLicense() : null,
                params != null ? params.getWorksByContract() : null,
                params != null ? params.getPriceFrom() : null,
                params != null ? params.getPriceTo() : null,
                params != null ? params.getCurrency() : null,
                params != null ? params.getUrgentBargain() : null,
                params != null ? params.getCanDeliver() : null,
                params != null ? params.getGiveAway() : null
        );
        Page<Advertisement> page = advertisementRepository.findAll(spec, pageable);
        List<Advertisement> content = page.getContent();
        if (content.isEmpty()) {
            return new PageImpl<>(List.of(), page.getPageable(), page.getTotalElements());
        }
        List<AdListItemDto> dtos = adListQueryService.buildListItems(content, currentUserId, true);
        return new PageImpl<>(dtos, page.getPageable(), page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdListItemDto> listByUser(String userId, Pageable pageable, String currentUserId) {
        Page<Advertisement> page = advertisementRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        List<Advertisement> content = page.getContent();
        if (content.isEmpty()) {
            return new PageImpl<>(List.of(), page.getPageable(), page.getTotalElements());
        }
        List<AdListItemDto> dtos = adListQueryService.buildListItems(content, currentUserId, false);
        return new PageImpl<>(dtos, page.getPageable(), page.getTotalElements());
    }

    @Override
    public long countByUser(String userId) {
        return advertisementRepository.countByUserIdAndStatus(userId, AdConstants.STATUS_ACTIVE);
    }

    @Override
    @Transactional(readOnly = true)
    public AdDetailDto getById(String id, String currentUserId) {
        Advertisement ad = advertisementRepository.findByIdWithUserAndImages(id)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", id));
        return adDetailDtoBuilder.build(ad, currentUserId);
    }

    @Override
    @Transactional
    public void recordView(String id) {
        if (advertisementRepository.existsById(id)) {
            advertisementRepository.incrementViews(id);
        }
    }
}

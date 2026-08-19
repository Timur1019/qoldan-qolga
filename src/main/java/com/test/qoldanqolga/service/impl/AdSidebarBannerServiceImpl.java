package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.adsidebar.AdSidebarBannerDto;
import com.test.qoldanqolga.dto.adsidebar.CreateAdSidebarBannerRequest;
import com.test.qoldanqolga.dto.adsidebar.UpdateAdSidebarBannerRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.AdSidebarBanner;
import com.test.qoldanqolga.repository.AdSidebarBannerRepository;
import com.test.qoldanqolga.service.AdSidebarBannerService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdSidebarBannerServiceImpl implements AdSidebarBannerService {

    private static final int PUBLIC_LIMIT = 2;

    private final AdSidebarBannerRepository repository;

    @Override
    @Cacheable("adSidebarBanners")
    @Transactional(readOnly = true)
    public List<AdSidebarBannerDto> listPublic() {
        return repository.findAllByEnabledTrueAndDeletedAtIsNullOrderBySortOrderAscIdAsc()
                .stream()
                .map(this::toDto)
                .limit(PUBLIC_LIMIT)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdSidebarBannerDto> listForAdmin() {
        return repository.findAllByDeletedAtIsNullOrderBySortOrderAscIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "adSidebarBanners", allEntries = true)
    public AdSidebarBannerDto create(CreateAdSidebarBannerRequest request) {
        AdSidebarBanner entity = new AdSidebarBanner();
        apply(entity, request.getTitle(), request.getImageUrl(), request.getLinkUrl(),
                request.getEnabled(), request.getSortOrder());
        repository.save(entity);
        LogUtil.info(AdSidebarBannerServiceImpl.class, "Ad sidebar banner created: id={}", entity.getId());
        return toDto(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adSidebarBanners", allEntries = true)
    public AdSidebarBannerDto update(String id, UpdateAdSidebarBannerRequest request) {
        AdSidebarBanner entity = findActive(id);
        apply(entity, request.getTitle(), request.getImageUrl(), request.getLinkUrl(),
                request.getEnabled(), request.getSortOrder());
        repository.save(entity);
        LogUtil.info(AdSidebarBannerServiceImpl.class, "Ad sidebar banner updated: id={}", id);
        return toDto(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "adSidebarBanners", allEntries = true)
    public void delete(String id) {
        AdSidebarBanner entity = findActive(id);
        entity.setDeletedAt(Instant.now());
        repository.save(entity);
        LogUtil.info(AdSidebarBannerServiceImpl.class, "Ad sidebar banner deleted: id={}", id);
    }

    private AdSidebarBanner findActive(String id) {
        return repository.findById(id)
                .filter(b -> b.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Реклама в карточке", id));
    }

    private void apply(
            AdSidebarBanner entity,
            String title,
            String imageUrl,
            String linkUrl,
            Boolean enabled,
            Integer sortOrder
    ) {
        entity.setTitle(blankToNull(title));
        entity.setImageUrl(imageUrl.trim());
        entity.setLinkUrl(linkUrl.trim());
        entity.setEnabled(enabled == null || enabled);
        entity.setSortOrder(sortOrder != null ? sortOrder : 0);
    }

    private static String blankToNull(String v) {
        if (v == null) return null;
        String t = v.trim();
        return t.isEmpty() ? null : t;
    }

    private AdSidebarBannerDto toDto(AdSidebarBanner b) {
        return AdSidebarBannerDto.builder()
                .id(b.getId())
                .title(b.getTitle())
                .imageUrl(b.getImageUrl())
                .linkUrl(b.getLinkUrl())
                .enabled(b.getEnabled())
                .sortOrder(b.getSortOrder())
                .build();
    }
}

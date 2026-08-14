package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.sitetop.CreateSiteTopBannerRequest;
import com.test.qoldanqolga.dto.sitetop.SiteTopBannerDto;
import com.test.qoldanqolga.dto.sitetop.UpdateSiteTopBannerRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.SiteTopBanner;
import com.test.qoldanqolga.repository.SiteTopBannerRepository;
import com.test.qoldanqolga.service.SiteTopBannerService;
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
public class SiteTopBannerServiceImpl implements SiteTopBannerService {

    private final SiteTopBannerRepository repository;

    @Override
    @Cacheable("siteTopBanners")
    @Transactional(readOnly = true)
    public List<SiteTopBannerDto> listPublic() {
        return repository.findAllByEnabledTrueAndDeletedAtIsNullOrderBySortOrderAscIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SiteTopBannerDto> listForAdmin() {
        return repository.findAllByDeletedAtIsNullOrderBySortOrderAscIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "siteTopBanners", allEntries = true)
    public SiteTopBannerDto create(CreateSiteTopBannerRequest request) {
        SiteTopBanner entity = new SiteTopBanner();
        apply(entity, request.getTitle(), request.getLinkText(), request.getLinkUrl(),
                request.getIconUrl(), request.getEnabled(), request.getSortOrder());
        repository.save(entity);
        LogUtil.info(SiteTopBannerServiceImpl.class, "Site top banner created: id={}", entity.getId());
        return toDto(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "siteTopBanners", allEntries = true)
    public SiteTopBannerDto update(String id, UpdateSiteTopBannerRequest request) {
        SiteTopBanner entity = repository.findById(id)
                .filter(b -> b.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Баннер шапки", id));
        apply(entity, request.getTitle(), request.getLinkText(), request.getLinkUrl(),
                request.getIconUrl(), request.getEnabled(), request.getSortOrder());
        repository.save(entity);
        LogUtil.info(SiteTopBannerServiceImpl.class, "Site top banner updated: id={}", id);
        return toDto(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "siteTopBanners", allEntries = true)
    public void delete(String id) {
        SiteTopBanner entity = repository.findById(id)
                .filter(b -> b.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Баннер шапки", id));
        entity.setDeletedAt(Instant.now());
        repository.save(entity);
        LogUtil.info(SiteTopBannerServiceImpl.class, "Site top banner deleted: id={}", id);
    }

    private void apply(
            SiteTopBanner entity,
            String title,
            String linkText,
            String linkUrl,
            String iconUrl,
            Boolean enabled,
            Integer sortOrder
    ) {
        entity.setTitle(title != null ? title.trim() : "");
        entity.setLinkText(blankToNull(linkText));
        entity.setLinkUrl(blankToNull(linkUrl));
        entity.setIconUrl(blankToNull(iconUrl));
        entity.setEnabled(enabled == null || enabled);
        entity.setSortOrder(sortOrder != null ? sortOrder : 0);
    }

    private static String blankToNull(String v) {
        if (v == null) return null;
        String t = v.trim();
        return t.isEmpty() ? null : t;
    }

    private SiteTopBannerDto toDto(SiteTopBanner b) {
        return SiteTopBannerDto.builder()
                .id(b.getId())
                .title(b.getTitle())
                .linkText(b.getLinkText())
                .linkUrl(b.getLinkUrl())
                .iconUrl(b.getIconUrl())
                .enabled(b.getEnabled())
                .sortOrder(b.getSortOrder())
                .build();
    }
}

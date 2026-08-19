package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.homesell.CreateHomeSellBannerRequest;
import com.test.qoldanqolga.dto.homesell.HomeSellBannerDto;
import com.test.qoldanqolga.dto.homesell.UpdateHomeSellBannerRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.HomeSellBanner;
import com.test.qoldanqolga.repository.HomeSellBannerRepository;
import com.test.qoldanqolga.service.HomeSellBannerService;
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
public class HomeSellBannerServiceImpl implements HomeSellBannerService {

    private final HomeSellBannerRepository repository;

    @Override
    @Cacheable("homeSellBanners")
    @Transactional(readOnly = true)
    public List<HomeSellBannerDto> listPublic() {
        return repository.findAllByEnabledTrueAndDeletedAtIsNullOrderBySortOrderAscIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeSellBannerDto> listForAdmin() {
        return repository.findAllByDeletedAtIsNullOrderBySortOrderAscIdAsc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    @CacheEvict(value = "homeSellBanners", allEntries = true)
    public HomeSellBannerDto create(CreateHomeSellBannerRequest request) {
        HomeSellBanner entity = new HomeSellBanner();
        apply(entity, request.getKicker(), request.getTitle(), request.getSubtitle(),
                request.getCtaText(), request.getCtaUrl(), request.getImageUrl(),
                request.getEnabled(), request.getSortOrder());
        repository.save(entity);
        LogUtil.info(HomeSellBannerServiceImpl.class, "Home sell banner created: id={}", entity.getId());
        return toDto(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "homeSellBanners", allEntries = true)
    public HomeSellBannerDto update(String id, UpdateHomeSellBannerRequest request) {
        HomeSellBanner entity = findActive(id);
        apply(entity, request.getKicker(), request.getTitle(), request.getSubtitle(),
                request.getCtaText(), request.getCtaUrl(), request.getImageUrl(),
                request.getEnabled(), request.getSortOrder());
        repository.save(entity);
        LogUtil.info(HomeSellBannerServiceImpl.class, "Home sell banner updated: id={}", id);
        return toDto(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "homeSellBanners", allEntries = true)
    public void delete(String id) {
        HomeSellBanner entity = findActive(id);
        entity.setDeletedAt(Instant.now());
        repository.save(entity);
        LogUtil.info(HomeSellBannerServiceImpl.class, "Home sell banner deleted: id={}", id);
    }

    private HomeSellBanner findActive(String id) {
        return repository.findById(id)
                .filter(b -> b.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Баннер «продавайте»", id));
    }

    private void apply(
            HomeSellBanner entity,
            String kicker,
            String title,
            String subtitle,
            String ctaText,
            String ctaUrl,
            String imageUrl,
            Boolean enabled,
            Integer sortOrder
    ) {
        entity.setKicker(blankToNull(kicker));
        entity.setTitle(title != null ? title.trim() : "");
        entity.setSubtitle(blankToNull(subtitle));
        entity.setCtaText(blankToNull(ctaText));
        entity.setCtaUrl(blankToNull(ctaUrl));
        entity.setImageUrl(blankToNull(imageUrl));
        entity.setEnabled(enabled == null || enabled);
        entity.setSortOrder(sortOrder != null ? sortOrder : 0);
    }

    private static String blankToNull(String v) {
        if (v == null) return null;
        String t = v.trim();
        return t.isEmpty() ? null : t;
    }

    private HomeSellBannerDto toDto(HomeSellBanner b) {
        return HomeSellBannerDto.builder()
                .id(b.getId())
                .kicker(b.getKicker())
                .title(b.getTitle())
                .subtitle(b.getSubtitle())
                .ctaText(b.getCtaText())
                .ctaUrl(b.getCtaUrl())
                .imageUrl(b.getImageUrl())
                .enabled(b.getEnabled())
                .sortOrder(b.getSortOrder())
                .build();
    }
}

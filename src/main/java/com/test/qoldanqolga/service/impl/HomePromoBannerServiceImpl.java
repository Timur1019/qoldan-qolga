package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.homepromo.CreateHomePromoBannerRequest;
import com.test.qoldanqolga.dto.homepromo.HomePromoBannerDto;
import com.test.qoldanqolga.dto.homepromo.UpdateHomePromoBannerRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.HomePromoBanner;
import com.test.qoldanqolga.repository.HomePromoBannerRepository;
import com.test.qoldanqolga.service.HomePromoBannerService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomePromoBannerServiceImpl implements HomePromoBannerService {

    private final HomePromoBannerRepository repository;

    @Override
    @Cacheable("promoBanners")
    public List<HomePromoBannerDto> listForHome() {
        return repository.findAllByOrderBySortOrderAscIdAsc().stream()
                .filter(b -> b.getDeletedAt() == null)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<HomePromoBannerDto> listForAdmin() {
        return repository.findAllByOrderBySortOrderAscIdAsc().stream()
                .filter(b -> b.getDeletedAt() == null)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public HomePromoBannerDto getById(String id) {
        return repository.findById(id)
                .filter(b -> b.getDeletedAt() == null)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Баннер", id));
    }

    @Override
    @Transactional
    @CacheEvict(value = "promoBanners", allEntries = true)
    public HomePromoBannerDto create(CreateHomePromoBannerRequest request) {
        HomePromoBanner entity = new HomePromoBanner();
        entity.setTitle(request.getTitle());
        entity.setSubtitle(Optional.ofNullable(request.getSubtitle()).orElse(""));
        entity.setBadge(request.getBadge());
        entity.setLink(request.getLink());
        entity.setImageUrl(request.getImageUrl());
        entity.setSortOrder(Optional.ofNullable(request.getSortOrder()).orElse(0));
        entity = repository.save(entity);
        LogUtil.info(HomePromoBannerServiceImpl.class, "Home promo banner created: id={}", entity.getId());
        return toDto(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "promoBanners", allEntries = true)
    public HomePromoBannerDto update(String id, UpdateHomePromoBannerRequest request) {
        HomePromoBanner entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Баннер", id));
        if (request.getTitle() != null) entity.setTitle(request.getTitle());
        if (request.getSubtitle() != null) entity.setSubtitle(request.getSubtitle());
        if (request.getBadge() != null) entity.setBadge(request.getBadge());
        if (request.getLink() != null) entity.setLink(request.getLink());
        if (request.getImageUrl() != null) entity.setImageUrl(request.getImageUrl());
        if (request.getSortOrder() != null) entity.setSortOrder(request.getSortOrder());
        entity = repository.save(entity);
        LogUtil.info(HomePromoBannerServiceImpl.class, "Home promo banner updated: id={}", id);
        return toDto(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "promoBanners", allEntries = true)
    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Баннер", id);
        }
        repository.deleteById(id);
        LogUtil.info(HomePromoBannerServiceImpl.class, "Home promo banner deleted: id={}", id);
    }

    private HomePromoBannerDto toDto(HomePromoBanner b) {
        return HomePromoBannerDto.builder()
                .id(b.getId())
                .title(b.getTitle())
                .subtitle(b.getSubtitle())
                .badge(b.getBadge())
                .link(b.getLink())
                .imageUrl(b.getImageUrl())
                .sortOrder(b.getSortOrder())
                .build();
    }
}

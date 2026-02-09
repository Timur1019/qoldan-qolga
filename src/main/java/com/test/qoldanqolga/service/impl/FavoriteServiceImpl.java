package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.Favorite;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.FavoriteRepository;
import com.test.qoldanqolga.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementMapper advertisementMapper;

    @Override
    @Transactional
    public void add(String userId, Long advertisementId) {
        if (favoriteRepository.existsByUserIdAndAdvertisementId(userId, advertisementId)) {
            return;
        }
        if (!advertisementRepository.existsById(advertisementId)) {
            throw new ResourceNotFoundException("Объявление", advertisementId);
        }
        Favorite f = new Favorite();
        f.setUserId(userId);
        f.setAdvertisementId(advertisementId);
        favoriteRepository.save(f);
    }

    @Override
    @Transactional
    public void remove(String userId, Long advertisementId) {
        favoriteRepository.deleteByUserIdAndAdvertisementId(userId, advertisementId);
    }

    @Override
    @Transactional
    public void removeAllByAdvertisementId(Long advertisementId) {
        favoriteRepository.deleteByAdvertisementId(advertisementId);
    }

    @Override
    @Transactional
    public boolean toggle(String userId, Long advertisementId) {
        Optional<Favorite> opt = favoriteRepository.findByUserIdAndAdvertisementId(userId, advertisementId);
        if (opt.isPresent()) {
            favoriteRepository.delete(opt.get());
            return false;
        }
        add(userId, advertisementId);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavorite(String userId, Long advertisementId) {
        return userId != null && favoriteRepository.existsByUserIdAndAdvertisementId(userId, advertisementId);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<Long> getFavoriteAdIds(String userId) {
        if (userId == null) return Set.of();
        List<Long> list = favoriteRepository.findAdvertisementIdsByUserId(userId);
        return new HashSet<>(list);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdListItemDto> getFavoriteAds(String userId, Pageable pageable) {
        Page<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        List<Long> adIds = favorites.getContent().stream()
                .map(Favorite::getAdvertisementId)
                .toList();
        if (adIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }
        List<Advertisement> ads = advertisementRepository.findByIdInWithImages(adIds);
        Map<Long, Advertisement> adMap = ads.stream().collect(Collectors.toMap(Advertisement::getId, a -> a));
        List<AdListItemDto> dtos = adIds.stream()
                .map(adMap::get)
                .filter(Objects::nonNull)
                .map(ad -> {
                    AdListItemDto dto = advertisementMapper.toListItemDto(ad);
                    dto.setMainImageUrl(advertisementMapper.getMainImageUrl(ad));
                    dto.setFavorite(true);
                    return dto;
                })
                .toList();
        return new PageImpl<>(dtos, pageable, favorites.getTotalElements());
    }
}

package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.AdImage;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.Favorite;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.FavoriteRepository;
import com.test.qoldanqolga.service.FavoriteService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final AdvertisementRepository advertisementRepository;
    private final AdvertisementMapper advertisementMapper;

    @Override
    @Transactional
    public void add(String userId, String advertisementId) {
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
        LogUtil.debug(FavoriteServiceImpl.class, "Favorite added: userId={} adId={}", userId, advertisementId);
    }

    @Override
    @Transactional
    public void remove(String userId, String advertisementId) {
        favoriteRepository.deleteByUserIdAndAdvertisementId(userId, advertisementId);
    }

    @Override
    @Transactional
    public void removeAllByAdvertisementId(String advertisementId) {
        favoriteRepository.deleteByAdvertisementId(advertisementId);
    }

    @Override
    @Transactional
    public boolean toggle(String userId, String advertisementId) {
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
    public boolean isFavorite(String userId, String advertisementId) {
        return userId != null && favoriteRepository.existsByUserIdAndAdvertisementId(userId, advertisementId);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<String> getFavoriteAdIds(String userId) {
        if (userId == null) return Set.of();
        List<String> list = favoriteRepository.findAdvertisementIdsByUserId(userId);
        return new HashSet<>(list);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdListItemDto> getFavoriteAds(String userId, Pageable pageable) {
        Page<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        List<String> adIds = favorites.getContent().stream()
                .map(Favorite::getAdvertisementId)
                .toList();
        if (adIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }
        List<Advertisement> ads = advertisementRepository.findByIdInWithImages(adIds);
        Map<String, Advertisement> adMap = ads.stream().collect(Collectors.toMap(Advertisement::getId, a -> a));
        List<AdListItemDto> dtos = adIds.stream()
                .map(adMap::get)
                .filter(Objects::nonNull)
                .map(ad -> {
                    AdListItemDto dto = advertisementMapper.toListItemDto(ad);
                    dto.setMainImageUrl(advertisementMapper.getMainImageUrl(ad));
                    dto.setImageUrls(ad.getImages() == null ? List.of() : ad.getImages().stream()
                            .sorted(Comparator.comparing(AdImage::getOrderNum).thenComparing(AdImage::getId))
                            .map(AdImage::getUrl)
                            .toList());
                    dto.setFavorite(true);
                    return dto;
                })
                .toList();
        return new PageImpl<>(dtos, pageable, favorites.getTotalElements());
    }
}

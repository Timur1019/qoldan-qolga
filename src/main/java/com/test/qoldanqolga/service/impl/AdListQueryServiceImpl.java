package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.mapper.AdvertisementMapper;
import com.test.qoldanqolga.model.AdImage;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.AdImageRepository;
import com.test.qoldanqolga.repository.ReviewRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.AdListQueryService;
import com.test.qoldanqolga.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdListQueryServiceImpl implements AdListQueryService {

    private final AdImageRepository adImageRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteService favoriteService;
    private final AdvertisementMapper advertisementMapper;

    @Override
    public List<AdListItemDto> buildListItems(List<Advertisement> ads, String currentUserId, boolean withUserRatings) {
        if (ads == null || ads.isEmpty()) {
            return List.of();
        }
        List<String> adIds = ads.stream().map(Advertisement::getId).collect(Collectors.toList());
        List<AdImage> allImages = adImageRepository.findByAdIdInOrderByOrderNumAscIdAsc(adIds);
        Map<String, String> mainUrlByAdId = new HashMap<>();
        Map<String, List<String>> urlsByAdId = new HashMap<>();
        for (String adId : adIds) {
            List<AdImage> list = allImages.stream()
                    .filter(img -> img.getAdId().equals(adId))
                    .sorted(Comparator.comparing(AdImage::getOrderNum).thenComparing(AdImage::getId))
                    .collect(Collectors.toList());
            List<String> urls = list.stream().map(AdImage::getUrl).collect(Collectors.toList());
            urlsByAdId.put(adId, urls);
            String main = list.stream().filter(AdImage::getIsMain).findFirst().map(AdImage::getUrl)
                    .orElse(list.isEmpty() ? null : list.get(0).getUrl());
            mainUrlByAdId.put(adId, main);
        }
        Set<String> favoriteIds = currentUserId != null ? favoriteService.getFavoriteAdIds(currentUserId) : Set.of();

        Map<String, User> usersById = Map.of();
        Map<String, double[]> ratingsByUser = Map.of();
        if (withUserRatings) {
            List<String> userIds = ads.stream().map(Advertisement::getUserId).distinct().collect(Collectors.toList());
            if (!userIds.isEmpty()) {
                usersById = userRepository.findAllById(userIds).stream().collect(Collectors.toMap(User::getId, u -> u));
                ratingsByUser = new HashMap<>();
                for (Object[] row : reviewRepository.findAverageAndCountByTargetUserIdIn(userIds)) {
                    String uid = (String) row[0];
                    double avg = row[1] != null ? ((Number) row[1]).doubleValue() : 0;
                    long cnt = row[2] != null ? ((Number) row[2]).longValue() : 0;
                    ratingsByUser.put(uid, new double[]{avg, cnt});
                }
            }
        }

        Map<String, User> finalUsersById = usersById;
        Map<String, double[]> finalRatingsByUser = ratingsByUser;
        return ads.stream().map(ad -> {
            AdListItemDto dto = advertisementMapper.toDto(ad);
            dto.setMainImageUrl(mainUrlByAdId.get(ad.getId()));
            dto.setImageUrls(urlsByAdId.getOrDefault(ad.getId(), List.of()));
            dto.setFavorite(favoriteIds.contains(ad.getId()));
            dto.setUserId(ad.getUserId());
            dto.setPhone(ad.getPhone());
            User u = finalUsersById.get(ad.getUserId());
            if (u != null) {
                dto.setUserDisplayName(u.getDisplayName());
                dto.setUserAvatar(u.getAvatar());
            }
            double[] r = finalRatingsByUser.get(ad.getUserId());
            if (r != null) {
                dto.setAverageRating(r[0]);
                dto.setTotalReviews((long) r[1]);
            }
            return dto;
        }).collect(Collectors.toList());
    }
}

package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.dto.admin.AdminAdStatItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserListItemDto;
import com.test.qoldanqolga.mapper.AdminUserListMapper;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.AdminStatsService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class AdminStatsServiceImpl implements AdminStatsService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Tashkent");

    private final UserRepository userRepository;
    private final AdvertisementRepository advertisementRepository;
    private final AdminUserListMapper adminUserListMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserListItemDto> getUsers(String filter, Pageable pageable) {
        Instant startOfToday = LocalDate.now(ZONE).atStartOfDay(ZONE).toInstant();
        Instant inactiveCutoff = LocalDate.now(ZONE).minusDays(30).atStartOfDay(ZONE).toInstant();
        Page<User> page = switch (normalize(filter)) {
            case "activeToday" -> userRepository.findByDeletedAtIsNullAndLastSeenAtGreaterThanEqual(startOfToday, pageable);
            case "registeredToday" -> userRepository.findByDeletedAtIsNullAndCreatedAtGreaterThanEqual(startOfToday, pageable);
            case "inactiveUsers" -> userRepository.findInactiveSince(inactiveCutoff, pageable);
            default -> userRepository.findByDeletedAtIsNull(pageable);
        };
        LogUtil.debug(AdminStatsServiceImpl.class, "Admin stats users filter={} count={}", filter, page.getTotalElements());
        return page.map(adminUserListMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminAdStatItemDto> getAds(String filter, Pageable pageable) {
        Instant startOfToday = LocalDate.now(ZONE).atStartOfDay(ZONE).toInstant();
        Page<Advertisement> page = "adsToday".equals(normalize(filter))
                ? advertisementRepository.findByDeletedAtIsNullAndCreatedAtGreaterThanEqual(startOfToday, pageable)
                : advertisementRepository.findByDeletedAtIsNullAndStatus(AdConstants.STATUS_ACTIVE, pageable);
        LogUtil.debug(AdminStatsServiceImpl.class, "Admin stats ads filter={} count={}", filter, page.getTotalElements());
        return page.map(this::toAdDto);
    }

    private AdminAdStatItemDto toAdDto(Advertisement ad) {
        AdminAdStatItemDto dto = new AdminAdStatItemDto();
        dto.setId(ad.getId());
        dto.setTitle(ad.getTitle());
        dto.setCategory(ad.getCategory());
        dto.setStatus(ad.getStatus());
        dto.setUserId(ad.getUserId());
        dto.setCreatedAt(ad.getCreatedAt());
        User seller = ad.getUser();
        dto.setUserDisplayName(seller != null ? seller.getDisplayName() : null);
        return dto;
    }

    private static String normalize(String filter) {
        return filter == null ? "" : filter.trim();
    }
}

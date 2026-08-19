package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.dto.admin.AdminDashboardDto;
import com.test.qoldanqolga.dto.admin.AdminDayStatDto;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.AdminDashboardService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Tashkent");
    private static final int SERIES_DAYS = 7;

    private final UserRepository userRepository;
    private final AdvertisementRepository advertisementRepository;

    @Override
    public AdminDashboardDto getDashboard() {
        Instant startOfToday = LocalDate.now(ZONE).atStartOfDay(ZONE).toInstant();
        Instant seriesFrom = LocalDate.now(ZONE).minusDays(SERIES_DAYS - 1L).atStartOfDay(ZONE).toInstant();
        Instant inactiveCutoff = LocalDate.now(ZONE).minusDays(30).atStartOfDay(ZONE).toInstant();

        AdminDashboardDto dto = AdminDashboardDto.builder()
                .totalUsers(userRepository.countByDeletedAtIsNull())
                .verifiedUsers(userRepository.countByProfileVerifiedTrue())
                .pendingVerification(userRepository.countByVerificationRequestedAtNotNullAndProfileVerifiedFalse())
                .activeToday(userRepository.countByDeletedAtIsNullAndLastSeenAtGreaterThanEqual(startOfToday))
                .registeredToday(userRepository.countByDeletedAtIsNullAndCreatedAtGreaterThanEqual(startOfToday))
                .inactiveUsers(userRepository.countInactiveSince(inactiveCutoff))
                .adsToday(advertisementRepository.countByDeletedAtIsNullAndCreatedAtGreaterThanEqual(startOfToday))
                .adsTotal(advertisementRepository.countByDeletedAtIsNullAndStatus(AdConstants.STATUS_ACTIVE))
                .series(buildSeries(seriesFrom, userRepository.countRegistrationsByDay(seriesFrom),
                        userRepository.countActiveByDay(seriesFrom)))
                .build();
        LogUtil.debug(AdminDashboardServiceImpl.class, "Admin dashboard loaded users={}", dto.getTotalUsers());
        return dto;
    }

    private List<AdminDayStatDto> buildSeries(Instant from, List<Object[]> registrations, List<Object[]> active) {
        Map<LocalDate, Long> byReg = toDayMap(registrations);
        Map<LocalDate, Long> byActive = toDayMap(active);
        LocalDate start = from.atZone(ZONE).toLocalDate();
        LocalDate end = LocalDate.now(ZONE);
        List<AdminDayStatDto> out = new ArrayList<>();
        for (LocalDate day = start; !day.isAfter(end); day = day.plusDays(1)) {
            out.add(new AdminDayStatDto(
                    day.toString(),
                    byReg.getOrDefault(day, 0L),
                    byActive.getOrDefault(day, 0L)));
        }
        return out;
    }

    private static Map<LocalDate, Long> toDayMap(List<Object[]> rows) {
        Map<LocalDate, Long> map = new HashMap<>();
        if (rows == null) {
            return map;
        }
        for (Object[] row : rows) {
            if (row == null || row.length < 2 || row[0] == null) {
                continue;
            }
            LocalDate day = toLocalDate(row[0]);
            long count = ((Number) row[1]).longValue();
            map.put(day, count);
        }
        return map;
    }

    private static LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        return LocalDate.parse(String.valueOf(value));
    }
}

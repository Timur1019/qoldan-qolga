package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.admin.AdminReportListItemDto;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.AdReport;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.AdReportRepository;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.AdminReportService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminReportServiceImpl implements AdminReportService {

    private final AdReportRepository adReportRepository;
    private final AdvertisementRepository advertisementRepository;
    private final UserRepository userRepository;

    @Override
    public Page<AdminReportListItemDto> getReports(Pageable pageable) {
        Page<AdReport> page = adReportRepository.findAllByOrderByCreatedAtDesc(pageable);
        Set<String> adIds = page.getContent().stream().map(AdReport::getAdId).collect(Collectors.toSet());
        Map<String, Advertisement> adMap = advertisementRepository.findAllById(adIds).stream()
                .collect(Collectors.toMap(Advertisement::getId, a -> a));
        Set<String> userIds = page.getContent().stream()
                .flatMap(r -> {
                    Advertisement ad = adMap.get(r.getAdId());
                    if (ad != null) {
                        return java.util.stream.Stream.of(ad.getUserId(), r.getReporterId());
                    }
                    return java.util.stream.Stream.of(r.getReporterId());
                })
                .collect(Collectors.toSet());
        Map<String, String> userNames = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, User::getDisplayName, (a, b) -> a));
        return page.map(r -> toDto(r, adMap.get(r.getAdId()), userNames));
    }

    @Override
    @Transactional
    public void notifySeller(String reportId) {
        AdReport report = adReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("AdReport", reportId));
        report.setSellerNotifiedAt(Instant.now());
        adReportRepository.save(report);
        LogUtil.info(AdminReportServiceImpl.class, "Admin notified seller for report: reportId={}", reportId);
    }

    private AdminReportListItemDto toDto(AdReport r, Advertisement ad, Map<String, String> userNames) {
        AdminReportListItemDto dto = new AdminReportListItemDto();
        dto.setId(r.getId());
        dto.setAdId(r.getAdId());
        dto.setAdTitle(ad != null ? ad.getTitle() : null);
        dto.setOwnerId(ad != null ? ad.getUserId() : null);
        dto.setOwnerDisplayName(ad != null ? userNames.get(ad.getUserId()) : null);
        dto.setReporterId(r.getReporterId());
        dto.setReporterDisplayName(userNames.get(r.getReporterId()));
        dto.setReason(r.getReason());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setSellerNotifiedAt(r.getSellerNotifiedAt());
        return dto;
    }
}

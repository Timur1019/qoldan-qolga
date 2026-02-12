package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.ad.ReportAdRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.AdReport;
import com.test.qoldanqolga.repository.AdReportRepository;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.service.AdReportService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdReportServiceImpl implements AdReportService {

    private final AdReportRepository adReportRepository;
    private final AdvertisementRepository advertisementRepository;

    @Override
    @Transactional
    public void report(String adId, ReportAdRequest request, String reporterId) {
        if (!advertisementRepository.existsById(adId)) {
            throw new ResourceNotFoundException("Advertisement", adId);
        }
        if (adReportRepository.existsByAdIdAndReporterId(adId, reporterId)) {
            return; // already reported by this user, silently ignore
        }
        AdReport report = new AdReport();
        report.setAdId(adId);
        report.setReporterId(reporterId);
        report.setReason(truncate(request.getReason(), 50));
        report.setComment(request.getComment() != null ? request.getComment().trim() : null);
        adReportRepository.save(report);
        LogUtil.info(AdReportServiceImpl.class, "Ad reported: adId={} reporterId={}", adId, reporterId);
    }

    private static String truncate(String s, int maxLen) {
        if (s == null) return null;
        return s.length() <= maxLen ? s : s.substring(0, maxLen);
    }
}

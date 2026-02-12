package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.ReportAdRequest;

public interface AdReportService {
    void report(String adId, ReportAdRequest request, String reporterId);
}

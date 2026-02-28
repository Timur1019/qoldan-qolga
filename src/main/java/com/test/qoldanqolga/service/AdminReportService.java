package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.admin.AdminReportListItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Админ: просмотр жалоб и уведомление продавца.
 */
public interface AdminReportService {

    Page<AdminReportListItemDto> getReports(Pageable pageable);

    void notifySeller(String reportId);
}

package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.business.BusinessApplicationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Админ-сервис заявок на статус «Магазин»: список, просмотр, одобрение, отклонение.
 */
public interface AdminBusinessApplicationService {

    Page<BusinessApplicationDto> list(Pageable pageable, String statusFilter);

    BusinessApplicationDto getById(String id);

    void approve(String id);

    void reject(String id);
}

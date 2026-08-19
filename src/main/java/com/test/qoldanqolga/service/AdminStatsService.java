package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.admin.AdminAdStatItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserListItemDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminStatsService {

    Page<AdminUserListItemDto> getUsers(String filter, Pageable pageable);

    Page<AdminAdStatItemDto> getAds(String filter, Pageable pageable);
}

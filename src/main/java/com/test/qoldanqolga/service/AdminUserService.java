package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.admin.AdminUserListItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Админ: управление пользователями (подтверждение профиля, роль, бан).
 */
public interface AdminUserService {

    Page<AdminUserListItemDto> getUsers(Pageable pageable);

    void updateUser(String userId, AdminUserUpdateRequest request);
}

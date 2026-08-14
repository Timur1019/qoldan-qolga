package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.admin.AdminUserListItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserUpdateRequest;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.Role;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.AdminUserService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;

    @Override
    public Page<AdminUserListItemDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toDto);
    }

    @Override
    @Transactional
    @CacheEvict(value = "authUsers", key = "#userId")
    public void updateUser(String userId, AdminUserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        if (request.getProfileVerified() != null) {
            user.setProfileVerified(request.getProfileVerified());
        }
        if (request.getRole() != null && !request.getRole().isBlank()) {
            user.setRole(parseRole(request.getRole()));
        }
        if (request.getBannedUntil() != null) {
            user.setBannedUntil(request.getBannedUntil());
        }
        if (request.getBanReason() != null) {
            user.setBanReason(request.getBanReason().length() > 500
                    ? request.getBanReason().substring(0, 500) : request.getBanReason());
        }
        userRepository.save(user);
        LogUtil.info(AdminUserServiceImpl.class, "Admin updated user: userId={}", userId);
    }

    private AdminUserListItemDto toDto(User u) {
        AdminUserListItemDto dto = new AdminUserListItemDto();
        dto.setId(u.getId());
        dto.setEmail(u.getEmail());
        dto.setDisplayName(u.getDisplayName());
        dto.setRole(u.getRole() != null ? u.getRole().name() : null);
        dto.setProfileVerified(Boolean.TRUE.equals(u.getProfileVerified()));
        dto.setVerificationRequestedAt(u.getVerificationRequestedAt());
        dto.setBannedUntil(u.getBannedUntil());
        dto.setBanReason(u.getBanReason());
        return dto;
    }

    private static Role parseRole(String value) {
        try {
            return Role.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return Role.USER;
        }
    }
}

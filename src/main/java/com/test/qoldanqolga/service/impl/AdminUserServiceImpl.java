package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.admin.AdminCreateUserRequest;
import com.test.qoldanqolga.dto.admin.AdminUserListItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserUpdateRequest;
import com.test.qoldanqolga.exception.ConflictException;
import com.test.qoldanqolga.exception.ErrorCode;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.mapper.AdminUserListMapper;
import com.test.qoldanqolga.model.Role;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.AdminUserService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminUserListMapper adminUserListMapper;

    @Override
    public Page<AdminUserListItemDto> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(adminUserListMapper::toDto);
    }

    @Override
    @Transactional
    public AdminUserListItemDto createUser(AdminCreateUserRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName().trim());
        user.setRole(parseRole(request.getRole()));
        user.setLastSeenAt(Instant.now());
        user = userRepository.save(user);
        LogUtil.info(AdminUserServiceImpl.class, "Admin created user: userId={} email={}", user.getId(), email);
        return adminUserListMapper.toDto(user);
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

    private static Role parseRole(String value) {
        if (value == null || value.isBlank()) {
            return Role.USER;
        }
        try {
            return Role.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return Role.USER;
        }
    }
}

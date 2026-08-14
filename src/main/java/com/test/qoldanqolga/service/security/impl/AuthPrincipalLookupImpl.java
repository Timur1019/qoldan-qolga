package com.test.qoldanqolga.service.security.impl;

import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.security.UserPrincipal;
import com.test.qoldanqolga.service.security.AuthPrincipalLookup;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthPrincipalLookupImpl implements AuthPrincipalLookup {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "authUsers", key = "#userId", unless = "#result == null")
    public UserPrincipal findActive(String userId) {
        UserPrincipal principal = userRepository.findById(userId)
                .filter(user -> !user.isDeleted() && !user.isCurrentlyBanned())
                .map(UserPrincipal::new)
                .orElse(null);
        LogUtil.debug(AuthPrincipalLookupImpl.class, "Auth principal lookup: userId={} found={}", userId, principal != null);
        return principal;
    }
}

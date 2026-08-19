package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.UserLastSeenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserLastSeenServiceImpl implements UserLastSeenService {

    private static final Duration TOUCH_EVERY = Duration.ofMinutes(15);

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void touch(User user) {
        if (user == null || user.getId() == null) {
            return;
        }
        Instant now = Instant.now();
        if (user.getLastSeenAt() != null && user.getLastSeenAt().isAfter(now.minus(TOUCH_EVERY))) {
            return;
        }
        user.setLastSeenAt(now);
        userRepository.save(user);
    }
}

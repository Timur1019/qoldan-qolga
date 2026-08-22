package com.test.qoldanqolga.service.notification.impl;

import com.test.qoldanqolga.model.UserKnownDevice;
import com.test.qoldanqolga.repository.UserKnownDeviceRepository;
import com.test.qoldanqolga.service.notification.LoginDeviceTracker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class LoginDeviceTrackerImpl implements LoginDeviceTracker {

    private final UserKnownDeviceRepository userKnownDeviceRepository;

    @Override
    @Transactional
    public boolean registerAndIsNew(String userId, String deviceId, String platform) {
        if (userId == null || userId.isBlank() || deviceId == null || deviceId.isBlank()) {
            return false;
        }
        String normalizedDeviceId = deviceId.trim();
        var existing = userKnownDeviceRepository.findByUserIdAndDeviceIdAndDeletedAtIsNull(userId, normalizedDeviceId);
        if (existing.isPresent()) {
            UserKnownDevice device = existing.get();
            device.setLastSeenAt(Instant.now());
            if (platform != null && !platform.isBlank()) {
                device.setPlatform(platform.trim().toUpperCase());
            }
            userKnownDeviceRepository.save(device);
            return false;
        }
        UserKnownDevice device = new UserKnownDevice();
        device.setUserId(userId);
        device.setDeviceId(normalizedDeviceId);
        device.setPlatform(platform != null ? platform.trim().toUpperCase() : null);
        device.setLastSeenAt(Instant.now());
        userKnownDeviceRepository.save(device);
        return true;
    }
}

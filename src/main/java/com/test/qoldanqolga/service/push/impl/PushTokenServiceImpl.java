package com.test.qoldanqolga.service.push.impl;

import com.test.qoldanqolga.dto.push.RegisterPushTokenRequest;
import com.test.qoldanqolga.exception.ValidationException;
import com.test.qoldanqolga.model.DevicePushToken;
import com.test.qoldanqolga.repository.DevicePushTokenRepository;
import com.test.qoldanqolga.service.push.PushTokenService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PushTokenServiceImpl implements PushTokenService {

    private final DevicePushTokenRepository devicePushTokenRepository;

    @Override
    @Transactional
    public void register(String userId, RegisterPushTokenRequest request) {
        String token = request.getToken() != null ? request.getToken().trim() : "";
        if (token.isEmpty()) {
            throw new ValidationException(List.of("Токен пустой"));
        }
        String platform = request.getPlatform() != null
                ? request.getPlatform().trim().toUpperCase(Locale.ROOT)
                : "IOS";
        DevicePushToken row = devicePushTokenRepository.findByToken(token).orElseGet(DevicePushToken::new);
        row.setUserId(userId);
        row.setToken(token);
        row.setPlatform(platform);
        row.setChatEnabled(!Boolean.FALSE.equals(request.getChatEnabled()));
        row.setSystemEnabled(!Boolean.FALSE.equals(request.getSystemEnabled()));
        row.setPromoEnabled(!Boolean.FALSE.equals(request.getPromoEnabled()));
        row.setDeletedAt(null);
        devicePushTokenRepository.save(row);
        LogUtil.info(PushTokenServiceImpl.class, "Push token registered: userId={} platform={}", userId, platform);
    }

    @Override
    @Transactional
    public void unregister(String userId, String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        devicePushTokenRepository.deleteByTokenAndUserId(token.trim(), userId);
    }
}

package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.DevicePushToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface DevicePushTokenRepository extends JpaRepository<DevicePushToken, String> {

    Optional<DevicePushToken> findByToken(String token);

    List<DevicePushToken> findByUserIdAndDeletedAtIsNull(String userId);

    @Modifying
    void deleteByTokenAndUserId(String token, String userId);
}

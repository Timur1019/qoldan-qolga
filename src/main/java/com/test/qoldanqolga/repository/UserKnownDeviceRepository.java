package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.UserKnownDevice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserKnownDeviceRepository extends JpaRepository<UserKnownDevice, String> {

    Optional<UserKnownDevice> findByUserIdAndDeviceIdAndDeletedAtIsNull(String userId, String deviceId);
}

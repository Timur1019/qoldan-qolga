package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.PhoneOtp;
import com.test.qoldanqolga.model.PhoneOtpStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface PhoneOtpRepository extends JpaRepository<PhoneOtp, String> {

    Optional<PhoneOtp> findFirstByPhoneAndStatusInAndExpiresAtAfterAndDeletedAtIsNullOrderByCreatedAtDesc(
            String phone,
            Iterable<PhoneOtpStatus> statuses,
            Instant now
    );

    Optional<PhoneOtp> findFirstBySmsIdAndDeletedAtIsNull(Long smsId);

    Optional<PhoneOtp> findFirstByRequestIdAndDeletedAtIsNull(String requestId);

    long countByPhoneAndCreatedAtAfterAndDeletedAtIsNull(String phone, Instant after);
}

package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.config.DevSmsProperties;
import com.test.qoldanqolga.dto.auth.AuthResponse;
import com.test.qoldanqolga.dto.auth.PhoneSendCodeRequest;
import com.test.qoldanqolga.dto.auth.PhoneSendCodeResponse;
import com.test.qoldanqolga.dto.auth.PhoneVerifyRequest;
import com.test.qoldanqolga.dto.auth.SmsCallbackRequest;
import com.test.qoldanqolga.dto.devsms.DevSmsSendResult;
import com.test.qoldanqolga.exception.BusinessException;
import com.test.qoldanqolga.exception.ErrorCode;
import com.test.qoldanqolga.exception.InvalidCredentialsException;
import com.test.qoldanqolga.mapper.UserMapper;
import com.test.qoldanqolga.model.PhoneOtp;
import com.test.qoldanqolga.model.PhoneOtpStatus;
import com.test.qoldanqolga.model.Role;
import com.test.qoldanqolga.model.SmsDeliveryStatus;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.PhoneOtpRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.security.JwtUtil;
import com.test.qoldanqolga.service.PhoneAuthService;
import com.test.qoldanqolga.service.sms.DevSmsClient;
import com.test.qoldanqolga.util.LogUtil;
import com.test.qoldanqolga.util.PhoneUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.EnumSet;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PhoneAuthServiceImpl implements PhoneAuthService {

    private static final ZoneId TASHKENT = ZoneId.of("Asia/Tashkent");
    private static final DateTimeFormatter DEV_SMS_TIME =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final SecureRandom RANDOM = new SecureRandom();

    private final PhoneOtpRepository phoneOtpRepository;
    private final UserRepository userRepository;
    private final DevSmsClient devSmsClient;
    private final DevSmsProperties properties;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public PhoneSendCodeResponse sendCode(PhoneSendCodeRequest request) {
        String phone = PhoneUtil.normalize(request.getPhone());
        Instant now = Instant.now();

        long recent = phoneOtpRepository.countByPhoneAndCreatedAtAfterAndDeletedAtIsNull(
                phone, now.minusSeconds(3600));
        if (recent >= properties.getMaxSendsPerHour()) {
            throw new BusinessException(ErrorCode.OTP_RATE_LIMITED);
        }

        Optional<PhoneOtp> active = phoneOtpRepository
                .findFirstByPhoneAndStatusInAndExpiresAtAfterAndDeletedAtIsNullOrderByCreatedAtDesc(
                        phone,
                        EnumSet.of(PhoneOtpStatus.PENDING, PhoneOtpStatus.SENT),
                        now
                );
        if (active.isPresent()) {
            PhoneOtp last = active.get();
            long elapsed = now.getEpochSecond() - last.getCreatedAt().getEpochSecond();
            long cooldown = properties.getResendCooldownSeconds();
            if (elapsed < cooldown) {
                throw new BusinessException(
                        ErrorCode.OTP_RATE_LIMITED,
                        "Повторная отправка через " + (cooldown - elapsed) + " сек."
                );
            }
            last.setStatus(PhoneOtpStatus.EXPIRED);
            phoneOtpRepository.save(last);
        }

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        PhoneOtp otp = new PhoneOtp();
        otp.setPhone(phone);
        otp.setCodeHash(passwordEncoder.encode(code));
        otp.setStatus(PhoneOtpStatus.PENDING);
        otp.setSmsStatus(SmsDeliveryStatus.PENDING);
        otp.setAttempts(0);
        otp.setExpiresAt(now.plusSeconds(properties.getOtpTtlSeconds()));
        otp = phoneOtpRepository.save(otp);

        String debugCode = null;
        try {
            DevSmsSendResult result = devSmsClient.sendOtp(phone, code, properties.getOtpTemplateType());
            applySendResult(otp, result, now);
            if (result.isMock()) {
                debugCode = code;
                LogUtil.info(PhoneAuthServiceImpl.class, "OTP mock code phone={} code={}", phone, code);
            }
        } catch (BusinessException e) {
            otp.setStatus(PhoneOtpStatus.FAILED);
            otp.setSmsStatus(SmsDeliveryStatus.FAILED);
            otp.setFailedAt(now);
            phoneOtpRepository.save(otp);
            throw e;
        }

        phoneOtpRepository.save(otp);
        LogUtil.info(PhoneAuthServiceImpl.class, "OTP sent phone={} otpId={} smsStatus={}",
                phone, otp.getId(), otp.getSmsStatus());

        return new PhoneSendCodeResponse(
                phone,
                PhoneUtil.mask(phone),
                properties.getOtpTtlSeconds(),
                properties.getResendCooldownSeconds(),
                otp.getStatus().name().toLowerCase(Locale.ROOT),
                otp.getSmsStatus().name().toLowerCase(Locale.ROOT),
                debugCode
        );
    }

    @Override
    @Transactional
    public AuthResponse verify(PhoneVerifyRequest request) {
        String phone = PhoneUtil.normalize(request.getPhone());
        Instant now = Instant.now();

        PhoneOtp otp = phoneOtpRepository
                .findFirstByPhoneAndStatusInAndExpiresAtAfterAndDeletedAtIsNullOrderByCreatedAtDesc(
                        phone,
                        EnumSet.of(PhoneOtpStatus.PENDING, PhoneOtpStatus.SENT),
                        now
                )
                .orElseThrow(() -> new BusinessException(ErrorCode.OTP_EXPIRED));

        if (otp.getAttempts() >= properties.getMaxAttempts()) {
            otp.setStatus(PhoneOtpStatus.BLOCKED);
            phoneOtpRepository.save(otp);
            throw new BusinessException(ErrorCode.OTP_TOO_MANY_ATTEMPTS);
        }

        String code = request.getCode() != null ? request.getCode().trim() : "";
        if (!passwordEncoder.matches(code, otp.getCodeHash())) {
            otp.setAttempts(otp.getAttempts() + 1);
            if (otp.getAttempts() >= properties.getMaxAttempts()) {
                otp.setStatus(PhoneOtpStatus.BLOCKED);
            }
            phoneOtpRepository.save(otp);
            throw new InvalidCredentialsException(ErrorCode.INVALID_OTP);
        }

        otp.setStatus(PhoneOtpStatus.VERIFIED);
        otp.setVerifiedAt(now);
        phoneOtpRepository.save(otp);

        boolean isNew = false;
        User user = userRepository.findByPhone(phone).orElse(null);
        if (user == null || user.isDeleted()) {
            isNew = true;
            user = new User();
            user.setPhone(phone);
            user.setPhoneVerifiedAt(now);
            user.setRole(Role.USER);
            user.setDisplayName(resolveDisplayName(request.getDisplayName(), phone));
            user = userRepository.save(user);
            LogUtil.info(PhoneAuthServiceImpl.class, "Phone user registered: id={} phone={}", user.getId(), phone);
        } else {
            if (user.isCurrentlyBanned()) {
                throw new InvalidCredentialsException(ErrorCode.ACCOUNT_BANNED);
            }
            user.setPhoneVerifiedAt(now);
            if (request.getDisplayName() != null && !request.getDisplayName().isBlank()
                    && (user.getDisplayName() == null || user.getDisplayName().isBlank()
                    || user.getDisplayName().startsWith("User "))) {
                user.setDisplayName(request.getDisplayName().trim());
            }
            userRepository.save(user);
            LogUtil.debug(PhoneAuthServiceImpl.class, "Phone user logged in: id={}", user.getId());
        }

        AuthResponse response = userMapper.toAuthResponse(user, jwtUtil.createToken(user.getId(), user.getEmail()));
        response.setPhone(user.getPhone());
        response.setNewUser(isNew);
        return response;
    }

    @Override
    @Transactional
    public void handleSmsCallback(SmsCallbackRequest request) {
        if (request == null) {
            return;
        }
        Optional<PhoneOtp> found = Optional.empty();
        if (request.getSmsId() != null) {
            found = phoneOtpRepository.findFirstBySmsIdAndDeletedAtIsNull(request.getSmsId());
        }
        if (found.isEmpty() && request.getRequestId() != null && !request.getRequestId().isBlank()) {
            found = phoneOtpRepository.findFirstByRequestIdAndDeletedAtIsNull(request.getRequestId().trim());
        }
        if (found.isEmpty()) {
            LogUtil.warn(PhoneAuthServiceImpl.class, "SMS callback otp not found smsId={} requestId={}",
                    request.getSmsId(), request.getRequestId());
            return;
        }

        PhoneOtp otp = found.get();
        SmsDeliveryStatus smsStatus = mapSmsStatus(request.getStatus());
        otp.setSmsStatus(smsStatus);
        Instant sentAt = parseDevSmsTime(request.getSentAt());
        Instant deliveredAt = parseDevSmsTime(request.getDeliveredAt());
        Instant failedAt = parseDevSmsTime(request.getFailedAt());
        if (sentAt != null) {
            otp.setSentAt(sentAt);
        }
        if (deliveredAt != null) {
            otp.setDeliveredAt(deliveredAt);
        }
        if (failedAt != null) {
            otp.setFailedAt(failedAt);
        }
        if (smsStatus == SmsDeliveryStatus.FAILED && otp.getStatus() != PhoneOtpStatus.VERIFIED) {
            otp.setStatus(PhoneOtpStatus.FAILED);
        } else if (smsStatus == SmsDeliveryStatus.SENT && otp.getStatus() == PhoneOtpStatus.PENDING) {
            otp.setStatus(PhoneOtpStatus.SENT);
        }
        phoneOtpRepository.save(otp);
        LogUtil.info(PhoneAuthServiceImpl.class, "SMS callback otpId={} status={}", otp.getId(), smsStatus);
    }

    private void applySendResult(PhoneOtp otp, DevSmsSendResult result, Instant now) {
        otp.setSmsId(result.getSmsId());
        otp.setRequestId(result.getRequestId());
        otp.setPartsCount(result.getPartsCount());
        otp.setTotalCost(result.getTotalCost());
        SmsDeliveryStatus smsStatus = mapSmsStatus(result.getStatus());
        otp.setSmsStatus(smsStatus);
        if (smsStatus == SmsDeliveryStatus.FAILED) {
            otp.setStatus(PhoneOtpStatus.FAILED);
            otp.setFailedAt(now);
        } else {
            otp.setStatus(PhoneOtpStatus.SENT);
            otp.setSentAt(now);
        }
    }

    private static SmsDeliveryStatus mapSmsStatus(String raw) {
        if (raw == null || raw.isBlank()) {
            return SmsDeliveryStatus.PENDING;
        }
        return switch (raw.trim().toLowerCase(Locale.ROOT)) {
            case "sent" -> SmsDeliveryStatus.SENT;
            case "delivered" -> SmsDeliveryStatus.DELIVERED;
            case "failed" -> SmsDeliveryStatus.FAILED;
            default -> SmsDeliveryStatus.PENDING;
        };
    }

    private static Instant parseDevSmsTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(value.trim(), DEV_SMS_TIME).atZone(TASHKENT).toInstant();
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private static String resolveDisplayName(String requested, String phone) {
        if (requested != null && !requested.isBlank()) {
            return requested.trim();
        }
        String last4 = phone.length() >= 4 ? phone.substring(phone.length() - 4) : phone;
        return "User " + last4;
    }
}

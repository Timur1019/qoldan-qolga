package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.auth.AuthResponse;
import com.test.qoldanqolga.dto.auth.LoginRequest;
import com.test.qoldanqolga.dto.auth.RegisterRequest;
import com.test.qoldanqolga.dto.auth.StartVerificationRequest;
import com.test.qoldanqolga.dto.auth.StartVerificationResponse;
import com.test.qoldanqolga.dto.auth.UpdateProfileRequest;
import com.test.qoldanqolga.dto.auth.UserInfo;
import com.test.qoldanqolga.dto.auth.VerificationStartResult;
import com.test.qoldanqolga.service.MyIdVerificationResult;
import com.test.qoldanqolga.exception.ConflictException;
import com.test.qoldanqolga.exception.InvalidCredentialsException;
import com.test.qoldanqolga.mapper.UserMapper;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.security.JwtUtil;
import com.test.qoldanqolga.service.AuthService;
import com.test.qoldanqolga.service.MyIdService;
import com.test.qoldanqolga.util.JsonUtil;
import com.test.qoldanqolga.util.LogUtil;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final MyIdService myIdService;

    @Value("${app.myid.redirect-url:}")
    private String myidRedirectUrl;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Пользователь с таким email уже зарегистрирован");
        }
        User user = userMapper.toUser(request);
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName().trim());
        user = userRepository.save(user);
        LogUtil.info(AuthServiceImpl.class, "User registered: id={} email={}", user.getId(), user.getEmail());
        return userMapper.toAuthResponse(user, jwtUtil.createToken(user.getId(), user.getEmail()));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new InvalidCredentialsException("Неверный email или пароль"));
        if (user.isDeleted()) {
            throw new InvalidCredentialsException("Аккаунт недоступен");
        }
        if (user.isCurrentlyBanned()) {
            throw new InvalidCredentialsException("Аккаунт заблокирован");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Неверный email или пароль");
        }
        LogUtil.debug(AuthServiceImpl.class, "User logged in: id={}", user.getId());
        return userMapper.toAuthResponse(user, jwtUtil.createToken(user.getId(), user.getEmail()));
    }

    @Override
    public UserInfo getCurrentUser(String userId) {
        LogUtil.debug(AuthServiceImpl.class, "Get current user: userId={}", userId);
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .map(userMapper::toDto)
                .orElse(null);
    }

    @Override
    @Transactional
    public UserInfo updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElse(null);
        if (user == null) return null;
        user.setDisplayName(request.getDisplayName().trim());
        String newEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null;
        if (newEmail != null && !newEmail.equals(user.getEmail())) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new ConflictException("Пользователь с таким email уже зарегистрирован");
            }
            user.setEmail(newEmail);
        }
        String av = request.getAvatar();
        user.setAvatar(av != null && !av.isBlank() && av.length() <= 512 ? av.trim() : null);
        user.setAvatarPhotos(JsonUtil.toJson(request.getAvatarPhotos()));
        userRepository.save(user);
        LogUtil.info(AuthServiceImpl.class, "Profile updated: userId={}", userId);
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public VerificationStartResult startVerification(String userId, StartVerificationRequest request) {
        if (myIdService.isConfigured() && hasPhotoAndConsent(request)) {
            String passData = buildPassData(request);
            String birthDateIso = normalizeBirthDate(request.getBirthDate());
            MyIdVerificationResult result = myIdService.verify(passData, birthDateIso, request.getPhotoFront());
            if (result.isSuccess()) {
                userRepository.findById(userId).ifPresent(u -> {
                    u.setProfileVerified(true);
                    u.setVerificationRequestedAt(null);
                    userRepository.save(u);
                });
                return VerificationStartResult.ok(new StartVerificationResponse(null, null, "Верификация пройдена."));
            }
            return VerificationStartResult.badRequest(new StartVerificationResponse(null, null, result.getResultNote()));
        }
        userRepository.findById(userId).ifPresent(u -> {
            u.setVerificationRequestedAt(Instant.now());
            userRepository.save(u);
        });
        boolean hasMyIdUrl = myidRedirectUrl != null && !myidRedirectUrl.isBlank();
        String redirectUrl = hasMyIdUrl ? myidRedirectUrl : null;
        String message = hasMyIdUrl ? null : "Заявка принята. Модератор проверит данные и подтвердит профиль.";
        return VerificationStartResult.ok(new StartVerificationResponse(redirectUrl, null, message));
    }

    private static boolean hasPhotoAndConsent(StartVerificationRequest request) {
        return request.getPhotoFront() != null && !request.getPhotoFront().isBlank()
                && Boolean.TRUE.equals(request.getAgreedOnTerms());
    }

    private static String buildPassData(StartVerificationRequest request) {
        String series = (request.getDocumentSeries() != null ? request.getDocumentSeries() : "").replaceAll("\\s", "").toUpperCase();
        String number = (request.getDocumentNumber() != null ? request.getDocumentNumber() : "").replaceAll("\\s", "");
        return series + number;
    }

    private static String normalizeBirthDate(String birthDate) {
        if (birthDate == null || birthDate.isBlank()) return birthDate;
        if (birthDate.matches("\\d{4}-\\d{2}-\\d{2}")) return birthDate;
        String[] parts = birthDate.split("[\\.\\-/]");
        if (parts.length == 3 && parts[0].length() <= 2 && parts[1].length() <= 2) {
            return parts[2] + "-" + pad2(parts[1]) + "-" + pad2(parts[0]);
        }
        return birthDate;
    }

    private static String pad2(String s) {
        return s != null && s.length() == 1 ? "0" + s : s;
    }
}

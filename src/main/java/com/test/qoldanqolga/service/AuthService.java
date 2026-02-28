package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.auth.AuthResponse;
import com.test.qoldanqolga.dto.auth.LoginRequest;
import com.test.qoldanqolga.dto.auth.RegisterRequest;
import com.test.qoldanqolga.dto.auth.StartVerificationRequest;
import com.test.qoldanqolga.dto.auth.UpdateProfileRequest;
import com.test.qoldanqolga.dto.auth.UserInfo;
import com.test.qoldanqolga.dto.auth.VerificationStartResult;

/**
 * Сервис аутентификации и регистрации пользователей.
 */
public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserInfo getCurrentUser(String userId);

    UserInfo updateProfile(String userId, UpdateProfileRequest request);

    /**
     * Заявка на верификацию или вызов MyID. Возвращает статус и тело ответа (message).
     */
    VerificationStartResult startVerification(String userId, StartVerificationRequest request);
}

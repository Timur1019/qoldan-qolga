package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.auth.CompleteVerificationResponse;
import com.test.qoldanqolga.dto.auth.StartVerificationRequest;
import com.test.qoldanqolga.dto.auth.StartVerificationResponse;
import com.test.qoldanqolga.dto.myid.MyIdWebSession;
import com.test.qoldanqolga.exception.ErrorCode;
import com.test.qoldanqolga.exception.MyIdException;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.exception.ValidationException;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.MyIdService;
import com.test.qoldanqolga.service.VerificationService;
import com.test.qoldanqolga.service.verification.DocumentPassDataParser;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {

    private final UserRepository userRepository;
    private final MyIdService myIdService;

    @Override
    @Transactional
    public StartVerificationResponse start(String userId, StartVerificationRequest request, String clientIp) {
        User user = requireUser(userId);
        if (Boolean.TRUE.equals(user.getProfileVerified())) {
            return new StartVerificationResponse(null, null, "Профиль уже подтверждён.");
        }
        if (!Boolean.TRUE.equals(request.getAgreedOnTerms())) {
            throw new ValidationException(List.of("Нужно согласие на обработку персональных данных"));
        }
        if (!myIdService.isConfigured()) {
            throw new MyIdException(ErrorCode.MYID_NOT_CONFIGURED);
        }
        String passData = DocumentPassDataParser.passData(request.getDocumentSeries(), request.getDocumentNumber());
        String birthDate = DocumentPassDataParser.birthDateIso(request.getBirthDate());
        MyIdWebSession session = myIdService.createWebSession(passData, birthDate, clientIp, request.getLang());
        user.setMyidSessionId(session.getSessionId());
        user.setVerificationRequestedAt(Instant.now());
        userRepository.save(user);
        LogUtil.info(VerificationServiceImpl.class, "MyID verification started: userId={}", userId);
        return new StartVerificationResponse(session.getRedirectUrl(), null, "Перенаправление в MyID");
    }

    @Override
    @Transactional
    public CompleteVerificationResponse complete(String userId, String authCode, String sessionId) {
        User user = requireUser(userId);
        if (Boolean.TRUE.equals(user.getProfileVerified())) {
            return new CompleteVerificationResponse(true, "Профиль уже подтверждён.");
        }
        String expectedSession = user.getMyidSessionId();
        if (expectedSession == null || expectedSession.isBlank()) {
            throw new MyIdException(ErrorCode.VERIFICATION_FAILED, "Сессия проверки не найдена. Начните заново.");
        }
        if (!expectedSession.equalsIgnoreCase(sessionId == null ? "" : sessionId.trim())) {
            throw new MyIdException(ErrorCode.VERIFICATION_FAILED, "Сессия MyID не совпадает. Начните проверку заново.");
        }
        myIdService.completeWithAuthCode(authCode);
        user.setProfileVerified(true);
        user.setVerificationRequestedAt(null);
        user.setMyidSessionId(null);
        userRepository.save(user);
        LogUtil.info(VerificationServiceImpl.class, "MyID verification completed: userId={}", userId);
        return new CompleteVerificationResponse(true, "Проверка ID успешно пройдена.");
    }

    private User requireUser(String userId) {
        return userRepository.findById(userId)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));
    }
}

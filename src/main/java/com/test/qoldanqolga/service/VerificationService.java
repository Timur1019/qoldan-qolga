package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.auth.CompleteVerificationResponse;
import com.test.qoldanqolga.dto.auth.StartVerificationRequest;
import com.test.qoldanqolga.dto.auth.StartVerificationResponse;

public interface VerificationService {

    StartVerificationResponse start(String userId, StartVerificationRequest request, String clientIp);

    CompleteVerificationResponse complete(String userId, String authCode, String sessionId);
}

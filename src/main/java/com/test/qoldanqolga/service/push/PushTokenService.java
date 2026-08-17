package com.test.qoldanqolga.service.push;

import com.test.qoldanqolga.dto.push.RegisterPushTokenRequest;

public interface PushTokenService {

    void register(String userId, RegisterPushTokenRequest request);

    void unregister(String userId, String token);
}

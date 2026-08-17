package com.test.qoldanqolga.service.push.impl;

import com.test.qoldanqolga.service.push.ExpoPushClient;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExpoPushClientImpl implements ExpoPushClient {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    private final RestTemplate restTemplate;

    @Override
    public void send(String to, String title, String body, Map<String, Object> data, String channelId) {
        if (to == null || to.isBlank()) {
            return;
        }
        Map<String, Object> payload = new HashMap<>();
        payload.put("to", to);
        payload.put("title", title);
        payload.put("body", body);
        payload.put("sound", "default");
        payload.put("priority", "high");
        if (channelId != null) {
            payload.put("channelId", channelId);
        }
        if (data != null) {
            payload.put("data", data);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");
        try {
            restTemplate.postForEntity(EXPO_PUSH_URL, new HttpEntity<>(payload, headers), String.class);
        } catch (Exception e) {
            LogUtil.warn(ExpoPushClientImpl.class, "Expo push failed: {}", e.getMessage());
        }
    }
}

package com.test.qoldanqolga.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.test.qoldanqolga.service.MyIdService;
import com.test.qoldanqolga.service.MyIdVerificationResult;
import com.test.qoldanqolga.util.LogUtil;
import java.net.URI;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * Клиент MyID API: получение токена, создание задачи идентификации, опрос статуса по external_id.
 * Учётные данные используются только на бэкенде.
 */
@Service
public class MyIdServiceImpl implements MyIdService {

    private static final int RESULT_SUCCESS = 1;
    private static final int POLL_DELAY_MS = 500;
    private static final int POLL_MAX_ATTEMPTS = 60;
    private static final int INITIAL_DELAY_MS = 600;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.myid.base-url:}")
    private String baseUrl;

    @Value("${app.myid.path.access-token:/api/v1/oauth2/access-token}")
    private String pathAccessToken;

    @Value("${app.myid.path.create-task:/api/v1/authentication/simple-inplace-authentication-request-task}")
    private String pathCreateTask;

    @Value("${app.myid.path.status-by-external:/api/v1/authentication/authentication-request-status-by-external}")
    private String pathStatusByExternal;

    @Value("${app.myid.client-id:}")
    private String clientId;

    @Value("${app.myid.username:}")
    private String username;

    @Value("${app.myid.password:}")
    private String password;

    @Override
    public boolean isConfigured() {
        return baseUrl != null && !baseUrl.isBlank()
                && clientId != null && !clientId.isBlank()
                && username != null && !username.isBlank()
                && password != null && !password.isBlank();
    }

    @Override
    public MyIdVerificationResult verify(String passData, String birthDate, String photoBase64) {
        if (!isConfigured()) {
            LogUtil.warn(MyIdServiceImpl.class, "MyID verify called but not configured");
            return MyIdVerificationResult.failure(-1, "Сервис верификации не настроен");
        }
        String token = getAccessToken();
        if (token == null) {
            return MyIdVerificationResult.failure(-1, "Не удалось получить токен MyID");
        }
        String externalId = UUID.randomUUID().toString();
        if (!createTask(token, passData, birthDate, photoBase64, externalId)) {
            return MyIdVerificationResult.failure(-1, "Не удалось создать задачу идентификации");
        }
        sleep(INITIAL_DELAY_MS);
        return pollStatus(token, externalId);
    }

    private String getAccessToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("username", username);
        body.add("password", password);
        body.add("client_id", clientId);
        try {
            URI url = URI.create(baseUrl.replaceFirst("/$", "") + pathAccessToken);
            ResponseEntity<JsonNode> resp = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), JsonNode.class);
            if (resp.getBody() != null && resp.getBody().has("access_token")) {
                return resp.getBody().get("access_token").asText();
            }
        } catch (Exception e) {
            LogUtil.error(MyIdServiceImpl.class, "MyID getAccessToken failed", e);
        }
        return null;
    }

    private boolean createTask(String token, String passData, String birthDate, String photoBase64, String externalId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        Map<String, Object> body = Map.of(
                "pass_data", passData,
                "birth_date", birthDate,
                "photo_from_camera", Map.of("front", photoBase64 == null ? "" : photoBase64),
                "agreed_on_terms", true,
                "client_id", clientId,
                "external_id", externalId
        );
        try {
            URI url = URI.create(baseUrl.replaceFirst("/$", "") + pathCreateTask);
            ResponseEntity<JsonNode> resp = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), JsonNode.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null && resp.getBody().has("job_id")) {
                return true;
            }
        } catch (Exception e) {
            LogUtil.error(MyIdServiceImpl.class, "MyID createTask failed", e);
        }
        return false;
    }

    private MyIdVerificationResult pollStatus(String token, String externalId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        Map<String, String> body = Map.of("external_id", externalId, "client_id", clientId);
        URI url = URI.create(baseUrl.replaceFirst("/$", "") + pathStatusByExternal);
        for (int i = 0; i < POLL_MAX_ATTEMPTS; i++) {
            try {
                ResponseEntity<JsonNode> resp = restTemplate.postForEntity(url, new HttpEntity<>(body, headers), JsonNode.class);
                if (resp.getStatusCode().value() == 202) {
                    sleep(POLL_DELAY_MS);
                    continue;
                }
                if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                    JsonNode node = resp.getBody();
                    int resultCode = node.has("result_code") ? node.get("result_code").asInt() : -1;
                    String resultNote = node.has("result_note") ? node.get("result_note").asText() : null;
                    if (resultCode == RESULT_SUCCESS) {
                        return MyIdVerificationResult.success();
                    }
                    return MyIdVerificationResult.failure(resultCode, resultNote);
                }
            } catch (Exception e) {
                LogUtil.error(MyIdServiceImpl.class, "MyID pollStatus failed at attempt " + (i + 1), e);
            }
            sleep(POLL_DELAY_MS);
        }
        return MyIdVerificationResult.failure(-1, "Превышено время ожидания ответа MyID");
    }

    private static void sleep(int ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while waiting for MyID", e);
        }
    }
}

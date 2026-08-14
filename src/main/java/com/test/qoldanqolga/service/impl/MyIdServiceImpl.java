package com.test.qoldanqolga.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.test.qoldanqolga.config.MyIdProperties;
import com.test.qoldanqolga.dto.myid.MyIdProfile;
import com.test.qoldanqolga.dto.myid.MyIdWebSession;
import com.test.qoldanqolga.exception.ErrorCode;
import com.test.qoldanqolga.exception.MyIdException;
import com.test.qoldanqolga.service.MyIdService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MyIdServiceImpl implements MyIdService {

    private static final String GRANT_CLIENT_CREDENTIALS = "client_credentials";
    private static final String GRANT_PASSWORD = "password";
    private static final String GRANT_AUTH_CODE = "authorization_code";

    private final RestTemplate restTemplate;
    private final MyIdProperties properties;
    private final ObjectMapper objectMapper;

    @Override
    public boolean isConfigured() {
        return properties.isConfigured();
    }

    @Override
    public MyIdWebSession createWebSession(String passData, String birthDateIso, String ipAddress, String lang) {
        ensureConfigured();
        String token = getServiceAccessToken();
        String sessionId = requestWebSession(token, ipAddress);
        String redirectUrl = buildSdkUrl(sessionId, passData, birthDateIso, lang);
        return new MyIdWebSession(sessionId, redirectUrl);
    }

    @Override
    public MyIdProfile completeWithAuthCode(String authCode) {
        ensureConfigured();
        String personalToken = exchangeAuthCode(authCode);
        return fetchProfile(personalToken);
    }

    private void ensureConfigured() {
        if (!properties.isConfigured()) {
            throw new MyIdException(ErrorCode.MYID_NOT_CONFIGURED);
        }
    }

    private String getServiceAccessToken() {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", properties.getClientId().trim());
        body.add("client_secret", properties.resolvedSecret());
        if (hasText(properties.getUsername()) && hasText(properties.getPassword())) {
            body.add("grant_type", GRANT_PASSWORD);
            body.add("username", properties.getUsername().trim());
            body.add("password", properties.getPassword().trim());
        } else {
            body.add("grant_type", GRANT_CLIENT_CREDENTIALS);
        }
        return postToken(body, "service");
    }

    private String exchangeAuthCode(String authCode) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", GRANT_AUTH_CODE);
        body.add("code", authCode.trim());
        body.add("client_id", properties.getClientId().trim());
        body.add("client_secret", properties.resolvedSecret());
        body.add("redirect_uri", properties.getRedirectUri().trim());
        return postToken(body, "authorization_code");
    }

    private String postToken(MultiValueMap<String, String> body, String kind) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        try {
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(
                    URI.create(properties.apiUrl(properties.getAccessTokenPath())),
                    new HttpEntity<>(body, headers),
                    JsonNode.class
            );
            String token = text(response.getBody(), "access_token");
            if (!hasText(token)) {
                throw new MyIdException(ErrorCode.MYID_FAILED, "MyID не вернул access_token");
            }
            return token;
        } catch (HttpStatusCodeException e) {
            LogUtil.error(MyIdServiceImpl.class, "MyID token ({}) failed: {}", kind, e.getResponseBodyAsString());
            throw new MyIdException(ErrorCode.MYID_FAILED, extractError(e, "Не удалось получить токен MyID"));
        } catch (MyIdException e) {
            throw e;
        } catch (Exception e) {
            LogUtil.error(MyIdServiceImpl.class, "MyID token (" + kind + ") failed", e);
            throw new MyIdException(ErrorCode.MYID_FAILED, "Не удалось получить токен MyID");
        }
    }

    private String requestWebSession(String token, String ipAddress) {
        HttpHeaders headers = bearerJson(token);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("max_retries", Math.max(1, properties.getMaxRetries()));
        body.put("external_id", UUID.randomUUID().toString());
        if (hasText(ipAddress)) {
            body.put("ip_address", ipAddress);
        }
        try {
            ResponseEntity<JsonNode> response = restTemplate.postForEntity(
                    URI.create(properties.apiUrl(properties.getWebSessionsPath())),
                    new HttpEntity<>(body, headers),
                    JsonNode.class
            );
            String sessionId = firstText(response.getBody(), "session_id", "sessionId", "id");
            if (!hasText(sessionId) && response.getBody() != null && response.getBody().has("data")) {
                sessionId = firstText(response.getBody().get("data"), "session_id", "sessionId", "id");
            }
            if (!hasText(sessionId)) {
                throw new MyIdException(ErrorCode.MYID_FAILED, "MyID не вернул session_id");
            }
            LogUtil.info(MyIdServiceImpl.class, "MyID web session created");
            return sessionId;
        } catch (HttpStatusCodeException e) {
            LogUtil.error(MyIdServiceImpl.class, "MyID create session failed: {}", e.getResponseBodyAsString());
            throw new MyIdException(ErrorCode.MYID_FAILED, extractError(e, "Не удалось создать сессию MyID"));
        } catch (MyIdException e) {
            throw e;
        } catch (Exception e) {
            LogUtil.error(MyIdServiceImpl.class, "MyID create session failed", e);
            throw new MyIdException(ErrorCode.MYID_FAILED, "Не удалось создать сессию MyID");
        }
    }

    private MyIdProfile fetchProfile(String personalToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(personalToken);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    URI.create(properties.apiUrl(properties.getUsersMePath())),
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    JsonNode.class
            );
            JsonNode body = response.getBody();
            if (body == null || body.isEmpty()) {
                throw new MyIdException(ErrorCode.MYID_FAILED, "MyID не вернул данные пользователя");
            }
            return new MyIdProfile(body.toString());
        } catch (HttpStatusCodeException e) {
            LogUtil.error(MyIdServiceImpl.class, "MyID users/me failed: {}", e.getResponseBodyAsString());
            throw new MyIdException(ErrorCode.MYID_FAILED, extractError(e, "Не удалось получить результат MyID"));
        } catch (MyIdException e) {
            throw e;
        } catch (Exception e) {
            LogUtil.error(MyIdServiceImpl.class, "MyID users/me failed", e);
            throw new MyIdException(ErrorCode.MYID_FAILED, "Не удалось получить результат MyID");
        }
    }

    private String buildSdkUrl(String sessionId, String passData, String birthDateIso, String lang) {
        String resolvedLang = hasText(lang) ? lang : properties.getDefaultLang();
        return UriComponentsBuilder.fromUriString(properties.sdkBase())
                .path("/")
                .queryParam("session_id", sessionId)
                .queryParam("pass_data", passData)
                .queryParam("birth_date", birthDateIso)
                .queryParam("is_resident", "1")
                .queryParam("redirect_uri", properties.getRedirectUri().trim())
                .queryParam("lang", resolvedLang == null ? "ru" : resolvedLang)
                .queryParam("theme", "light")
                .encode()
                .build()
                .toUriString();
    }

    private static HttpHeaders bearerJson(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private String extractError(HttpStatusCodeException e, String fallback) {
        JsonNode node = readJson(e.getResponseBodyAsString());
        String message = firstText(node, "message", "error_description", "error", "detail", "result_note");
        return hasText(message) ? message : fallback;
    }

    private JsonNode readJson(String raw) {
        if (!hasText(raw)) {
            return null;
        }
        try {
            return objectMapper.readTree(raw);
        } catch (Exception ignored) {
            return null;
        }
    }

    private static String text(JsonNode node, String field) {
        if (node == null || !node.has(field) || node.get(field).isNull()) {
            return null;
        }
        String value = node.get(field).asText();
        return hasText(value) ? value : null;
    }

    private static String firstText(JsonNode node, String... fields) {
        if (node == null) {
            return null;
        }
        for (String field : fields) {
            String value = text(node, field);
            if (value != null) {
                return value;
            }
        }
        return null;
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}

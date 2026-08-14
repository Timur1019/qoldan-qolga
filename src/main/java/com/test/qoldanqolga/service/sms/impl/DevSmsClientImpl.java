package com.test.qoldanqolga.service.sms.impl;

import com.test.qoldanqolga.config.DevSmsProperties;
import com.test.qoldanqolga.dto.devsms.DevSmsSendResponse;
import com.test.qoldanqolga.dto.devsms.DevSmsSendResult;
import com.test.qoldanqolga.exception.BusinessException;
import com.test.qoldanqolga.exception.ErrorCode;
import com.test.qoldanqolga.service.sms.DevSmsClient;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DevSmsClientImpl implements DevSmsClient {

    private final RestTemplate restTemplate;
    private final DevSmsProperties properties;

    @Override
    public DevSmsSendResult sendOtp(String phone, String otpCode, int templateType) {
        if (!properties.isConfigured()) {
            if (!properties.isMockWhenEmpty()) {
                throw new BusinessException(ErrorCode.SMS_NOT_CONFIGURED);
            }
            String mockId = UUID.randomUUID().toString();
            LogUtil.warn(DevSmsClientImpl.class, "DevSMS mock OTP phone={} code={} requestId={}",
                    phone, otpCode, mockId);
            return new DevSmsSendResult(null, mockId, "sent", 1, 0, true);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("phone", phone);
        body.put("type", "universal_otp");
        body.put("template_type", templateType);
        body.put("service_name", properties.resolvedServiceName());
        body.put("otp_code", otpCode);

        String callback = publicCallbackUrl(properties.getCallbackUrl());
        if (callback != null) {
            body.put("callback_url", callback);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(properties.getToken().trim());

        try {
            ResponseEntity<DevSmsSendResponse> response = restTemplate.postForEntity(
                    properties.apiUrl("/send_sms.php"),
                    new HttpEntity<>(body, headers),
                    DevSmsSendResponse.class
            );
            DevSmsSendResponse payload = response.getBody();
            if (payload == null || !Boolean.TRUE.equals(payload.getSuccess()) || payload.getData() == null) {
                String err = payload != null && payload.getMessage() != null
                        ? payload.getMessage()
                        : "empty response";
                LogUtil.error(DevSmsClientImpl.class, "DevSMS OTP failed: {}", err);
                throw new BusinessException(ErrorCode.SMS_SEND_FAILED, err);
            }
            DevSmsSendResponse.Data data = payload.getData();
            LogUtil.info(DevSmsClientImpl.class, "DevSMS OTP sent smsId={} status={}", data.getSmsId(), data.getStatus());
            return new DevSmsSendResult(
                    data.getSmsId(),
                    data.getRequestId(),
                    data.getStatus() != null ? data.getStatus() : "sent",
                    data.getPartsCount(),
                    data.getTotalCost(),
                    false
            );
        } catch (BusinessException e) {
            throw e;
        } catch (HttpStatusCodeException e) {
            String err = extractError(e.getResponseBodyAsString());
            LogUtil.error(DevSmsClientImpl.class, "DevSMS HTTP {}: {}", e.getStatusCode().value(), err);
            throw new BusinessException(ErrorCode.SMS_SEND_FAILED, err);
        } catch (RestClientException e) {
            LogUtil.error(DevSmsClientImpl.class, "DevSMS HTTP error", e);
            throw new BusinessException(ErrorCode.SMS_SEND_FAILED);
        }
    }

    static String publicCallbackUrl(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String url = raw.trim();
        String lower = url.toLowerCase(Locale.ROOT);
        if (!(lower.startsWith("http://") || lower.startsWith("https://"))) {
            return null;
        }
        if (lower.contains("localhost")
                || lower.contains("127.0.0.1")
                || lower.contains("0.0.0.0")
                || lower.contains("::1")) {
            LogUtil.warn(DevSmsClientImpl.class, "Skip DevSMS callback_url (localhost): {}", url);
            return null;
        }
        return url;
    }

    private static String extractError(String body) {
        if (body == null || body.isBlank()) {
            return "DevSMS request failed";
        }
        String trimmed = body.trim();
        int errIdx = trimmed.indexOf("\"error\"");
        if (errIdx >= 0) {
            int start = trimmed.indexOf('"', errIdx + 7);
            if (start >= 0) {
                int end = trimmed.indexOf('"', start + 1);
                if (end > start) {
                    return trimmed.substring(start + 1, end);
                }
            }
        }
        return trimmed.length() > 300 ? trimmed.substring(0, 300) : trimmed;
    }
}

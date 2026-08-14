package com.test.qoldanqolga.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.devsms")
public class DevSmsProperties {

    private String baseUrl = "https://devsms.uz/api";
    private String token = "";
    private String from = "4546";
    private String callbackUrl = "";
    /** Имя сервиса для universal_otp (2–50 символов). */
    private String serviceName = "Qoldan Qolga";
    /** 1=операция, 2=пароль, 3=регистрация, 4=вход */
    private int otpTemplateType = 4;
    /** Если токен пуст — OTP логируется, SMS не уходит (локальная разработка). */
    private boolean mockWhenEmpty = true;
    private int otpTtlSeconds = 300;
    private int resendCooldownSeconds = 60;
    private int maxAttempts = 5;
    private int maxSendsPerHour = 5;

    public String resolvedServiceName() {
        if (serviceName != null && !serviceName.isBlank()) {
            return serviceName.trim();
        }
        return "Qoldan Qolga";
    }

    public boolean isConfigured() {
        return token != null && !token.isBlank();
    }

    public String apiUrl(String path) {
        String base = baseUrl == null ? "" : baseUrl.trim();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base + (path.startsWith("/") ? path : "/" + path);
    }
}

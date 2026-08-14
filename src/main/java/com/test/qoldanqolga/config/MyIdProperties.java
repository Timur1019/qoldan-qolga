package com.test.qoldanqolga.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.myid")
public class MyIdProperties {

    private String baseUrl = "https://api.myid.uz";
    private String webSdkUrl = "https://web.myid.uz";
    private String accessTokenPath = "/api/v1/oauth2/access-token";
    private String webSessionsPath = "/api/v1/web/sessions";
    private String usersMePath = "/api/v1/users/me";
    private String clientId = "";
    private String clientSecret = "";
    private String username = "";
    private String password = "";
    private String redirectUri = "http://127.0.0.1:5173/dashboard/verification/callback";
    private int maxRetries = 3;
    private String defaultLang = "ru";

    public String resolvedSecret() {
        if (clientSecret != null && !clientSecret.isBlank()) {
            return clientSecret.trim();
        }
        return password == null ? "" : password.trim();
    }

    public boolean isConfigured() {
        return hasText(baseUrl)
                && hasText(webSdkUrl)
                && hasText(clientId)
                && hasText(resolvedSecret())
                && hasText(redirectUri);
    }

    public String apiUrl(String path) {
        return trimSlash(baseUrl) + (path.startsWith("/") ? path : "/" + path);
    }

    public String sdkBase() {
        return trimSlash(webSdkUrl);
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private static String trimSlash(String value) {
        if (value == null) {
            return "";
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }
}

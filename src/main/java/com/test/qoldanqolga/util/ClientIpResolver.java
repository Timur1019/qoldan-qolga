package com.test.qoldanqolga.util;

import jakarta.servlet.http.HttpServletRequest;

public final class ClientIpResolver {

    private ClientIpResolver() {
    }

    public static String resolve(HttpServletRequest request) {
        if (request == null) {
            return "127.0.0.1";
        }
        String forwarded = firstHeaderValue(request.getHeader("X-Forwarded-For"));
        if (forwarded != null) {
            return forwarded;
        }
        String realIp = firstHeaderValue(request.getHeader("X-Real-IP"));
        if (realIp != null) {
            return realIp;
        }
        String remote = request.getRemoteAddr();
        return remote == null || remote.isBlank() ? "127.0.0.1" : remote;
    }

    private static String firstHeaderValue(String header) {
        if (header == null || header.isBlank()) {
            return null;
        }
        return header.split(",")[0].trim();
    }
}

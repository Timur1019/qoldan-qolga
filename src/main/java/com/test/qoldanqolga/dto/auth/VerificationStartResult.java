package com.test.qoldanqolga.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

/**
 * Результат запуска верификации: HTTP-статус и тело ответа (одно и то же для 200 и 400).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VerificationStartResult {

    private int statusCode;
    private StartVerificationResponse response;

    public static VerificationStartResult ok(StartVerificationResponse response) {
        return new VerificationStartResult(HttpStatus.OK.value(), response);
    }

    public static VerificationStartResult badRequest(StartVerificationResponse response) {
        return new VerificationStartResult(HttpStatus.BAD_REQUEST.value(), response);
    }
}

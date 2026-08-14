package com.test.qoldanqolga.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

/**
 * Единый формат ответа об ошибке.
 * code + status всегда есть; errors — только при валидации полей.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ApiErrorResponse {

    private String code;
    private int status;
    private String message;
    private Map<String, String> errors;

    public static ApiErrorResponse of(String code, int status, String message) {
        return ApiErrorResponse.builder().code(code).status(status).message(message).build();
    }

    public static ApiErrorResponse of(String code, int status, String message, Map<String, String> errors) {
        return ApiErrorResponse.builder().code(code).status(status).message(message).errors(errors).build();
    }
}

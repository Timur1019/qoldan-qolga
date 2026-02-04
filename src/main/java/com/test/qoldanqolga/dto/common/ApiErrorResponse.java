package com.test.qoldanqolga.dto.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

/**
 * Единый формат ответа об ошибке для всего API.
 * <ul>
 *   <li>{@code message} — всегда есть</li>
 *   <li>{@code errors} — только при ошибках валидации (поле → сообщение)</li>
 * </ul>
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ApiErrorResponse {

    private String message;

    /**
     * Ошибки по полям (для MethodArgumentNotValidException).
     */
    private Map<String, String> errors;

    public static ApiErrorResponse of(String message) {
        return ApiErrorResponse.builder().message(message).build();
    }

    public static ApiErrorResponse of(String message, Map<String, String> errors) {
        return ApiErrorResponse.builder().message(message).errors(errors).build();
    }
}

package com.test.qoldanqolga.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StartVerificationRequest {

    @NotNull
    private String birthDate;

    @NotBlank(message = "Укажите серию документа")
    private String documentSeries;

    @NotBlank(message = "Укажите номер документа")
    private String documentNumber;

    /** Base64 Data URI фото лица (для MyID). Обязателен при включённой интеграции MyID. */
    private String photoFront;

    /** Согласие на обработку персональных данных. Должно быть true для вызова MyID. */
    private Boolean agreedOnTerms;
}

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

    @NotNull(message = "Нужно согласие на обработку персональных данных")
    private Boolean agreedOnTerms;

    private String lang;
}

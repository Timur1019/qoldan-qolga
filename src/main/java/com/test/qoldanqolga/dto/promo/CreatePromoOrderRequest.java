package com.test.qoldanqolga.dto.promo;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePromoOrderRequest {
    @NotBlank(message = "Выберите услугу")
    private String serviceCode;

    /** Нормализованный код услуги (trim). */
    public String getServiceCodeTrimmed() {
        return serviceCode != null ? serviceCode.trim() : null;
    }
}

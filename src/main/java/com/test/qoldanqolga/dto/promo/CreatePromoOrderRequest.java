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

    @NotBlank(message = "Выберите способ оплаты")
    private String provider;

    public String getServiceCodeTrimmed() {
        return serviceCode != null ? serviceCode.trim() : null;
    }

    public String getProviderTrimmed() {
        return provider != null ? provider.trim() : null;
    }
}

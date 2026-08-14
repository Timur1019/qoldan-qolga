package com.test.qoldanqolga.dto.currency;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Курс USD к UZS для отображения цен")
public class CurrencyRateDto {
    @Schema(description = "Сколько сумов за 1 USD")
    private double usdToUzs;
    @Schema(description = "Источник: CBU или FALLBACK")
    private String source;
}

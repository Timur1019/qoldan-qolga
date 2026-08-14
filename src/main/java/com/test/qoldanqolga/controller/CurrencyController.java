package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.currency.CurrencyRateDto;
import com.test.qoldanqolga.service.CurrencyRateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/currency")
@RequiredArgsConstructor
@Tag(name = "Currency")
public class CurrencyController {

    private final CurrencyRateService currencyRateService;

    @GetMapping("/rate")
    @Operation(summary = "Курс USD к UZS для пересчёта цен в фильтрах")
    @ApiResponse(responseCode = "200", description = "Курс получен")
    public ResponseEntity<CurrencyRateDto> getRate() {
        return ResponseEntity.ok(currencyRateService.getUsdToUzsRate());
    }
}

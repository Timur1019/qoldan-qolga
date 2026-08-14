package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.currency.CurrencyRateDto;

public interface CurrencyRateService {
    CurrencyRateDto getUsdToUzsRate();

    void refreshUsdToUzsRate();
}

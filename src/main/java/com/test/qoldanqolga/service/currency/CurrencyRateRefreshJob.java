package com.test.qoldanqolga.service.currency;

import com.test.qoldanqolga.service.CurrencyRateService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrencyRateRefreshJob {

    private final CurrencyRateService currencyRateService;

    @Scheduled(initialDelay = 2_000, fixedDelay = 1_800_000)
    public void refresh() {
        currencyRateService.refreshUsdToUzsRate();
        LogUtil.debug(CurrencyRateRefreshJob.class, "Scheduled currency rate refresh done");
    }
}

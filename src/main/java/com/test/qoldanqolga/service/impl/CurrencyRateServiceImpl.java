package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.config.CurrencyProperties;
import com.test.qoldanqolga.dto.currency.CurrencyRateDto;
import com.test.qoldanqolga.service.CurrencyRateService;
import com.test.qoldanqolga.service.currency.CurrencyRateClient;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrencyRateServiceImpl implements CurrencyRateService {

    private static final String CACHE_NAME = "currencyRate";
    private static final String CACHE_KEY = "usdUzs";

    private final CurrencyProperties currencyProperties;
    private final CurrencyRateClient currencyRateClient;
    private final CacheManager cacheManager;

    @Override
    public CurrencyRateDto getUsdToUzsRate() {
        Cache cache = cacheManager.getCache(CACHE_NAME);
        if (cache != null) {
            CurrencyRateDto cached = cache.get(CACHE_KEY, CurrencyRateDto.class);
            if (cached != null) {
                return cached;
            }
        }
        return fallback();
    }

    @Override
    public void refreshUsdToUzsRate() {
        CurrencyRateDto remote = currencyRateClient.fetchUsdToUzs();
        CurrencyRateDto value = remote != null ? remote : fallback();
        Cache cache = cacheManager.getCache(CACHE_NAME);
        if (cache != null) {
            cache.put(CACHE_KEY, value);
        }
        LogUtil.info(CurrencyRateServiceImpl.class, "Currency rate cached: source={} rate={}", value.getSource(), value.getUsdToUzs());
    }

    private CurrencyRateDto fallback() {
        return CurrencyRateDto.builder()
                .usdToUzs(currencyProperties.getUsdUzsFallback())
                .source("FALLBACK")
                .build();
    }
}

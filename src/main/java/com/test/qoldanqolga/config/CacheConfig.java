package com.test.qoldanqolga.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(
                cache("adsList", 2_000, 45, TimeUnit.SECONDS),
                cache("regions", 16, 6, TimeUnit.HOURS),
                cache("categories", 32, 2, TimeUnit.HOURS),
                cache("categoriesHome", 16, 2, TimeUnit.HOURS),
                cache("categoryRoots", 16, 2, TimeUnit.HOURS),
                cache("categoryByCode", 512, 2, TimeUnit.HOURS),
                cache("categoryBreadcrumb", 512, 2, TimeUnit.HOURS),
                cache("categoryChildren", 512, 2, TimeUnit.HOURS),
                cache("categoryParents", 16, 6, TimeUnit.HOURS),
                cache("categoryCodes", 512, 2, TimeUnit.HOURS),
                cache("brands", 32, 2, TimeUnit.HOURS),
                cache("brandsByCategory", 512, 2, TimeUnit.HOURS),
                cache("vehicleModels", 256, 2, TimeUnit.HOURS),
                cache("vehicleSpecOptions", 16, 6, TimeUnit.HOURS),
                cache("currencyRate", 8, 2, TimeUnit.HOURS),
                cache("promoBanners", 16, 15, TimeUnit.MINUTES),
                cache("siteTopBanners", 16, 15, TimeUnit.MINUTES),
                cache("homeSellBanners", 16, 15, TimeUnit.MINUTES),
                cache("adSidebarBanners", 16, 15, TimeUnit.MINUTES),
                cache("authUsers", 2_000, 60, TimeUnit.SECONDS)
        ));
        return manager;
    }

    private static CaffeineCache cache(String name, long maxSize, long duration, TimeUnit unit) {
        return new CaffeineCache(name, Caffeine.newBuilder()
                .maximumSize(maxSize)
                .expireAfterWrite(duration, unit)
                .recordStats()
                .build());
    }
}

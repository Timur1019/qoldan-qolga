package com.test.qoldanqolga.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "currency")
public class CurrencyProperties {
    /** Запасной курс USD → UZS, если CBU недоступен. */
    private double usdUzsFallback = 12800;
    /** URL JSON курсов ЦБ Узбекистана. */
    private String cbuJsonUrl = "https://cbu.uz/ru/arkhiv-kursov-valyut/json/";
}

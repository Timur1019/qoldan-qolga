package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.dto.promo.PromoServiceDto;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Конфигурация промо-услуг. Загрузка из application.yml (promo.services).
 */
@Data
@Component
@ConfigurationProperties(prefix = "promo")
public class PromoProperties {

    private Map<String, PromoServiceConfig> services = defaultServices();

    private static Map<String, PromoServiceConfig> defaultServices() {
        return Map.of(
                "maxi", new PromoServiceConfig(
                        "maxi",
                        "Макси карточка",
                        "Maksi kartochka",
                        new BigDecimal("13900"),
                        7,
                        "Объявление выше в поиске, крупная фотография, бейдж «Premium», фото-галерея.",
                        "E'lon qidiruvda yuqorida, yirik foto, \"Premium\" belgisi, foto-galereya."
                ),
                "up", new PromoServiceConfig(
                        "up",
                        "Вверх",
                        "Yuqoriga",
                        new BigDecimal("4000"),
                        28,
                        "Автоподнятие 5 раз — сейчас, затем на 7, 14, 21 и 28 день. Объявление поднимается вверх в ленте.",
                        "Avtoko'tarish 5 marta — hozir, keyin 7, 14, 21 va 28 kunda. E'lon lentada yuqoriga ko'tariladi."
                )
        );
    }

    public List<PromoServiceDto> toPromoServiceDtoList() {
        return services.values().stream()
                .map(c -> new PromoServiceDto(
                        c.getCode(),
                        c.getNameRu(),
                        c.getNameUz(),
                        c.getPrice(),
                        c.getDuration(),
                        c.getDescriptionRu(),
                        c.getDescriptionUz()
                ))
                .toList();
    }

    @Data
    public static class PromoServiceConfig {
        private String code;
        private String nameRu;
        private String nameUz;
        private BigDecimal price;
        private int duration;
        private String descriptionRu;
        private String descriptionUz;

        public PromoServiceConfig() {
        }

        public PromoServiceConfig(String code, String nameRu, String nameUz, BigDecimal price,
                                  int duration, String descriptionRu, String descriptionUz) {
            this.code = code;
            this.nameRu = nameRu;
            this.nameUz = nameUz;
            this.price = price;
            this.duration = duration;
            this.descriptionRu = descriptionRu;
            this.descriptionUz = descriptionUz;
        }
    }
}

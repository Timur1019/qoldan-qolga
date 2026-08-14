package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.dto.promo.PromoServiceDto;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Конфигурация промо-тарифов. Загрузка из application.yml (promo.services).
 */
@Data
@Component
@ConfigurationProperties(prefix = "promo")
public class PromoProperties {

    private Map<String, PromoServiceConfig> services = defaultServices();

    private static Map<String, PromoServiceConfig> defaultServices() {
        Map<String, PromoServiceConfig> map = new LinkedHashMap<>();
        map.put("day1", plan(
                "day1", "1 день", "1 kun", "10000", 1, 10, 0,
                true, false, false,
                List.of("Поднимем объявление", "VIP-метка", "Больше просмотров"),
                List.of("E'lonni ko'taramiz", "VIP belgi", "Ko'proq ko'rishlar"),
                "VIP + мгновенное поднятие",
                "VIP + darhol ko'tarish"
        ));
        map.put("week7", plan(
                "week7", "7 дней", "7 kun", "30000", 7, 20, 24,
                true, false, false,
                List.of("VIP", "Ежедневное поднятие", "Приоритет в списке"),
                List.of("VIP", "Har kuni ko'tarish", "Ro'yxatda ustuvorlik"),
                "VIP + ежедневное поднятие",
                "VIP + har kuni ko'tarish"
        ));
        map.put("month30", plan(
                "month30", "30 дней", "30 kun", "75000", 30, 30, 24,
                true, true, false,
                List.of("VIP", "Ежедневное поднятие", "TOP-размещение"),
                List.of("VIP", "Har kuni ko'tarish", "TOP joylashuv"),
                "VIP + ежедневное поднятие + TOP",
                "VIP + har kuni ko'tarish + TOP"
        ));
        map.put("premium", plan(
                "premium", "Premium", "Premium", "120000", 30, 40, 12,
                true, true, true,
                List.of("TOP-размещение", "VIP-метка", "Максимальный приоритет", "Выделение объявления", "Регулярное поднятие", "Больше показов"),
                List.of("TOP joylashuv", "VIP belgi", "Maksimal ustuvorlik", "E'lonni ajratib ko'rsatish", "Muntazam ko'tarish", "Ko'proq ko'rsatish"),
                "VIP + TOP + максимальный приоритет",
                "VIP + TOP + maksimal ustuvorlik"
        ));
        return map;
    }

    private static PromoServiceConfig plan(
            String code, String nameRu, String nameUz, String price, int durationDays, int priority,
            int boostIntervalHours, boolean vip, boolean top, boolean highlight,
            List<String> featuresRu, List<String> featuresUz,
            String descriptionRu, String descriptionUz
    ) {
        PromoServiceConfig c = new PromoServiceConfig();
        c.setCode(code);
        c.setNameRu(nameRu);
        c.setNameUz(nameUz);
        c.setPrice(new BigDecimal(price));
        c.setDuration(durationDays);
        c.setPriority(priority);
        c.setBoostIntervalHours(boostIntervalHours);
        c.setVip(vip);
        c.setTop(top);
        c.setHighlight(highlight);
        c.setFeaturesRu(new ArrayList<>(featuresRu));
        c.setFeaturesUz(new ArrayList<>(featuresUz));
        c.setDescriptionRu(descriptionRu);
        c.setDescriptionUz(descriptionUz);
        return c;
    }

    public List<PromoServiceDto> toPromoServiceDtoList() {
        return services.values().stream().map(this::toDto).toList();
    }

    public Optional<PromoServiceConfig> findByCode(String code) {
        if (code == null || code.isBlank()) {
            return Optional.empty();
        }
        PromoServiceConfig c = services.get(code.trim());
        return Optional.ofNullable(c);
    }

    private PromoServiceDto toDto(PromoServiceConfig c) {
        return new PromoServiceDto(
                c.getCode(),
                c.getNameRu(),
                c.getNameUz(),
                c.getPrice(),
                c.getDuration(),
                c.getDescriptionRu(),
                c.getDescriptionUz(),
                c.getPriority(),
                c.getBoostIntervalHours(),
                c.isVip(),
                c.isTop(),
                c.isHighlight(),
                c.getFeaturesRu() != null ? c.getFeaturesRu() : List.of(),
                c.getFeaturesUz() != null ? c.getFeaturesUz() : List.of()
        );
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
        private int priority;
        private int boostIntervalHours;
        private boolean vip = true;
        private boolean top;
        private boolean highlight;
        private List<String> featuresRu = new ArrayList<>();
        private List<String> featuresUz = new ArrayList<>();
    }
}

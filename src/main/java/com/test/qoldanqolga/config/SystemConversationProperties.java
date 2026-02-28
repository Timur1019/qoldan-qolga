package com.test.qoldanqolga.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Конфигурация системного диалога для уведомлений (подтверждение «Магазин»).
 */
@Component
@ConfigurationProperties(prefix = "app.system")
@Getter
@Setter
public class SystemConversationProperties {

    /** ID системного пользователя (отправитель уведомлений в чат). */
    private String userId = "00000000-0000-0000-0000-000000000001";
    /** ID системного объявления (диалог «Уведомления»). */
    private String adId = "00000000-0000-0000-0000-000000000002";
}

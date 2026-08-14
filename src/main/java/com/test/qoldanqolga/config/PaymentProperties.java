package com.test.qoldanqolga.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "payment")
public class PaymentProperties {

    private boolean mock = false;
    private Payme payme = new Payme();
    private Click click = new Click();

    @Data
    public static class Payme {
        private String merchantId = "";
        private String key = "";
        private String checkoutBaseUrl = "https://checkout.paycom.uz";
    }

    @Data
    public static class Click {
        private String merchantId = "";
        private String serviceId = "";
        private String secretKey = "";
        private String merchantUserId = "";
        private String checkoutBaseUrl = "https://my.click.uz/services/pay";
    }
}

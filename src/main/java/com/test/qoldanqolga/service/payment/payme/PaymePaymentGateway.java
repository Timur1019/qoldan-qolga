package com.test.qoldanqolga.service.payment.payme;

import com.test.qoldanqolga.config.AppPublicProperties;
import com.test.qoldanqolga.config.PaymentProperties;
import com.test.qoldanqolga.exception.ValidationException;
import java.util.List;
import com.test.qoldanqolga.model.PaymentProvider;
import com.test.qoldanqolga.model.PromoOrder;
import com.test.qoldanqolga.service.payment.PaymentGateway;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PaymePaymentGateway implements PaymentGateway {

    private final PaymentProperties paymentProperties;
    private final AppPublicProperties appPublicProperties;

    @Override
    public String provider() {
        return PaymentProvider.PAYME;
    }

    @Override
    public String createCheckout(PromoOrder order) {
        if (paymentProperties.isMock()) {
            return mockUrl(order);
        }
        PaymentProperties.Payme cfg = paymentProperties.getPayme();
        if (isBlank(cfg.getMerchantId()) || isBlank(cfg.getKey())) {
            throw new ValidationException(List.of("Payme не настроен: задайте PAYME_MERCHANT_ID и PAYME_KEY"));
        }

        // Payme amount — тийины (1 сум = 100)
        long amountTiyin = order.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        String returnUrl = UriComponentsBuilder
                .fromUriString(trimSlash(appPublicProperties.getPublicUrl()))
                .path("/dashboard/promo/result")
                .queryParam("orderId", order.getId())
                .queryParam("provider", PaymentProvider.PAYME)
                .build()
                .toUriString();

        String payload = "m=" + cfg.getMerchantId()
                + ";ac.order_id=" + order.getId()
                + ";a=" + amountTiyin
                + ";c=" + returnUrl;

        String encoded = Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String base = trimSlash(cfg.getCheckoutBaseUrl());
        return base + "/" + encoded;
    }

    private String mockUrl(PromoOrder order) {
        return UriComponentsBuilder
                .fromUriString(trimSlash(appPublicProperties.getPublicUrl()))
                .path("/dashboard/promo/result")
                .queryParam("orderId", order.getId())
                .queryParam("provider", PaymentProvider.PAYME)
                .queryParam("mock", "1")
                .build()
                .toUriString();
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private static String trimSlash(String url) {
        if (url == null || url.isBlank()) {
            return "http://localhost:3000";
        }
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}

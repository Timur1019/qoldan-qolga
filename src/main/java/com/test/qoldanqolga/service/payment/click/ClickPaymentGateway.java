package com.test.qoldanqolga.service.payment.click;

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

@Service
@RequiredArgsConstructor
public class ClickPaymentGateway implements PaymentGateway {

    private final PaymentProperties paymentProperties;
    private final AppPublicProperties appPublicProperties;

    @Override
    public String provider() {
        return PaymentProvider.CLICK;
    }

    @Override
    public String createCheckout(PromoOrder order) {
        if (paymentProperties.isMock()) {
            return mockUrl(order);
        }
        PaymentProperties.Click cfg = paymentProperties.getClick();
        if (isBlank(cfg.getMerchantId()) || isBlank(cfg.getServiceId()) || isBlank(cfg.getSecretKey())) {
            throw new ValidationException(List.of("Click не настроен: задайте CLICK_MERCHANT_ID, CLICK_SERVICE_ID и CLICK_SECRET_KEY"));
        }

        String returnUrl = UriComponentsBuilder
                .fromUriString(trimSlash(appPublicProperties.getPublicUrl()))
                .path("/dashboard/promo/result")
                .queryParam("orderId", order.getId())
                .queryParam("provider", PaymentProvider.CLICK)
                .build()
                .toUriString();

        return UriComponentsBuilder
                .fromUriString(trimSlash(cfg.getCheckoutBaseUrl()))
                .queryParam("service_id", cfg.getServiceId())
                .queryParam("merchant_id", cfg.getMerchantId())
                .queryParam("amount", order.getAmount().toPlainString())
                .queryParam("transaction_param", order.getId())
                .queryParam("return_url", returnUrl)
                .build()
                .toUriString();
    }

    private String mockUrl(PromoOrder order) {
        return UriComponentsBuilder
                .fromUriString(trimSlash(appPublicProperties.getPublicUrl()))
                .path("/dashboard/promo/result")
                .queryParam("orderId", order.getId())
                .queryParam("provider", PaymentProvider.CLICK)
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

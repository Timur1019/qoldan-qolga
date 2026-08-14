package com.test.qoldanqolga.service.payment;

import com.test.qoldanqolga.exception.ValidationException;
import com.test.qoldanqolga.model.PaymentProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentGatewayResolver {

    private final List<PaymentGateway> gateways;

    public PaymentGateway resolve(String provider) {
        String normalized = PaymentProvider.normalize(provider);
        if (normalized == null) {
            throw new ValidationException(List.of("Способ оплаты: укажите PAYME или CLICK"));
        }
        return gateways.stream()
                .filter(g -> normalized.equals(g.provider()))
                .findFirst()
                .orElseThrow(() -> new ValidationException(List.of("Платёжный провайдер не настроен: " + normalized)));
    }
}

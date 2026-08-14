package com.test.qoldanqolga.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.test.qoldanqolga.config.PaymentProperties;
import com.test.qoldanqolga.exception.ValidationException;
import java.util.List;
import com.test.qoldanqolga.service.payment.click.ClickMerchantService;
import com.test.qoldanqolga.service.payment.payme.PaymeMerchantService;
import com.test.qoldanqolga.service.promo.PromoActivationService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Hidden
public class PaymentCallbackController {

    private final PaymeMerchantService paymeMerchantService;
    private final ClickMerchantService clickMerchantService;
    private final PromoActivationService promoActivationService;
    private final PaymentProperties paymentProperties;

    @PostMapping("/payme")
    public ResponseEntity<ObjectNode> payme(
            @RequestBody JsonNode body,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ResponseEntity.ok(paymeMerchantService.handle(body, authorization));
    }

    @PostMapping("/click/prepare")
    public ResponseEntity<Map<String, Object>> clickPrepare(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(clickMerchantService.prepare(params));
    }

    @PostMapping("/click/complete")
    public ResponseEntity<Map<String, Object>> clickComplete(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(clickMerchantService.complete(params));
    }

    /**
     * Локальная/демо-активация без шлюза. Работает только при payment.mock=true.
     */
    @PostMapping("/mock/complete")
    public ResponseEntity<Map<String, String>> mockComplete(@RequestBody Map<String, String> body) {
        if (!paymentProperties.isMock()) {
            throw new ValidationException(List.of("Mock-оплата отключена"));
        }
        String orderId = body.get("orderId");
        if (orderId == null || orderId.isBlank()) {
            throw new ValidationException(List.of("orderId обязателен"));
        }
        promoActivationService.activatePaidOrder(orderId.trim());
        return ResponseEntity.ok(Map.of("status", "PAID", "orderId", orderId.trim()));
    }
}

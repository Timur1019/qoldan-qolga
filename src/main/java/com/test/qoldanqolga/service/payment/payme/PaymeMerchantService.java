package com.test.qoldanqolga.service.payment.payme;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.test.qoldanqolga.config.PaymentProperties;
import com.test.qoldanqolga.model.PromoOrder;
import com.test.qoldanqolga.model.PromoOrderStatus;
import com.test.qoldanqolga.repository.PromoOrderRepository;
import com.test.qoldanqolga.service.promo.PromoActivationService;
import com.test.qoldanqolga.service.notification.PaymentNotificationPublisher;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

/**
 * Payme Merchant API (JSON-RPC). Активация промо на PerformTransaction.
 */
@Service
@RequiredArgsConstructor
public class PaymeMerchantService {

    private static final int ERROR_AUTH = -32504;
    private static final int ERROR_ORDER = -31050;
    private static final int ERROR_AMOUNT = -31001;
    private static final int ERROR_METHOD = -32601;

    private final PaymentProperties paymentProperties;
    private final PromoOrderRepository promoOrderRepository;
    private final PromoActivationService promoActivationService;
    private final PaymentNotificationPublisher paymentNotificationPublisher;
    private final ObjectMapper objectMapper;

    public boolean authenticate(String authorizationHeader) {
        if (paymentProperties.isMock()) {
            return true;
        }
        String key = paymentProperties.getPayme().getKey();
        if (key == null || key.isBlank()) {
            return false;
        }
        if (authorizationHeader == null || !authorizationHeader.startsWith("Basic ")) {
            return false;
        }
        try {
            String decoded = new String(Base64.getDecoder().decode(authorizationHeader.substring(6)), StandardCharsets.UTF_8);
            // Paycom:<key>
            int idx = decoded.indexOf(':');
            if (idx < 0) {
                return false;
            }
            String password = decoded.substring(idx + 1);
            return key.equals(password);
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public ObjectNode handle(JsonNode request, String authHeader) {
        ObjectNode response = objectMapper.createObjectNode();
        if (request.has("id")) {
            response.set("id", request.get("id"));
        }

        if (!authenticate(authHeader)) {
            return error(response, ERROR_AUTH, "Unauthorized");
        }

        String method = text(request, "method");
        JsonNode params = request.path("params");

        return switch (method) {
            case "CheckPerformTransaction" -> checkPerform(response, params);
            case "CreateTransaction" -> createTransaction(response, params);
            case "PerformTransaction" -> performTransaction(response, params);
            case "CancelTransaction" -> cancelTransaction(response, params);
            case "CheckTransaction" -> checkTransaction(response, params);
            default -> error(response, ERROR_METHOD, "Method not found");
        };
    }

    private ObjectNode checkPerform(ObjectNode response, JsonNode params) {
        Optional<PromoOrder> orderOpt = findOrder(params);
        if (orderOpt.isEmpty()) {
            return error(response, ERROR_ORDER, "Order not found");
        }
        PromoOrder order = orderOpt.get();
        if (!amountMatches(order, params)) {
            return error(response, ERROR_AMOUNT, "Incorrect amount");
        }
        if (PromoOrderStatus.PAID.equals(order.getStatus())) {
            return error(response, ERROR_ORDER, "Order already paid");
        }
        ObjectNode result = objectMapper.createObjectNode();
        result.put("allow", true);
        response.set("result", result);
        return response;
    }

    private ObjectNode createTransaction(ObjectNode response, JsonNode params) {
        Optional<PromoOrder> orderOpt = findOrder(params);
        if (orderOpt.isEmpty()) {
            return error(response, ERROR_ORDER, "Order not found");
        }
        PromoOrder order = orderOpt.get();
        if (!amountMatches(order, params)) {
            return error(response, ERROR_AMOUNT, "Incorrect amount");
        }
        String paymeId = text(params, "id");
        if (paymeId != null && !paymeId.isBlank()) {
            order.setProviderTxnId(paymeId);
            promoOrderRepository.save(order);
        }
        ObjectNode result = objectMapper.createObjectNode();
        result.put("create_time", System.currentTimeMillis());
        result.put("transaction", order.getId());
        result.put("state", 1);
        response.set("result", result);
        return response;
    }

    private ObjectNode performTransaction(ObjectNode response, JsonNode params) {
        String paymeId = text(params, "id");
        PromoOrder order = paymeId != null
                ? promoOrderRepository.findByProviderTxnId(paymeId).orElse(null)
                : null;
        if (order == null) {
            order = findOrder(params).orElse(null);
        }
        if (order == null) {
            return error(response, ERROR_ORDER, "Order not found");
        }
        try {
            promoActivationService.activatePaidOrder(order);
        } catch (Exception e) {
            LogUtil.error(PaymeMerchantService.class, "Payme perform failed: {}", e.getMessage());
            return error(response, ERROR_ORDER, "Cannot activate order");
        }
        ObjectNode result = objectMapper.createObjectNode();
        result.put("transaction", order.getId());
        result.put("perform_time", System.currentTimeMillis());
        result.put("state", 2);
        response.set("result", result);
        return response;
    }

    private ObjectNode cancelTransaction(ObjectNode response, JsonNode params) {
        String paymeId = text(params, "id");
        PromoOrder order = paymeId != null
                ? promoOrderRepository.findByProviderTxnId(paymeId).orElse(null)
                : findOrder(params).orElse(null);
        if (order != null && !PromoOrderStatus.PAID.equals(order.getStatus())) {
            order.setStatus(PromoOrderStatus.CANCELLED);
            promoOrderRepository.save(order);
            paymentNotificationPublisher.publishFailed(order);
        }
        ObjectNode result = objectMapper.createObjectNode();
        result.put("transaction", order != null ? order.getId() : "");
        result.put("cancel_time", System.currentTimeMillis());
        result.put("state", -1);
        response.set("result", result);
        return response;
    }

    private ObjectNode checkTransaction(ObjectNode response, JsonNode params) {
        String paymeId = text(params, "id");
        PromoOrder order = paymeId != null
                ? promoOrderRepository.findByProviderTxnId(paymeId).orElse(null)
                : findOrder(params).orElse(null);
        if (order == null) {
            return error(response, ERROR_ORDER, "Order not found");
        }
        int state = PromoOrderStatus.PAID.equals(order.getStatus()) ? 2
                : PromoOrderStatus.CANCELLED.equals(order.getStatus()) ? -1 : 1;
        ObjectNode result = objectMapper.createObjectNode();
        result.put("create_time", order.getCreatedAt() != null ? order.getCreatedAt().toEpochMilli() : 0);
        result.put("perform_time", order.getPaidAt() != null ? order.getPaidAt().toEpochMilli() : 0);
        result.put("cancel_time", 0);
        result.put("transaction", order.getId());
        result.put("state", state);
        result.put("reason", state < 0 ? 5 : 0);
        response.set("result", result);
        return response;
    }

    private Optional<PromoOrder> findOrder(JsonNode params) {
        String orderId = null;
        JsonNode account = params.path("account");
        if (account.isObject()) {
            orderId = text(account, "order_id");
            if (orderId == null) {
                orderId = text(account, "orderId");
            }
        }
        if (orderId == null || orderId.isBlank()) {
            return Optional.empty();
        }
        return promoOrderRepository.findById(orderId.trim());
    }

    private boolean amountMatches(PromoOrder order, JsonNode params) {
        if (!params.has("amount")) {
            return true;
        }
        long expected = order.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
        long actual = params.path("amount").asLong();
        return expected == actual;
    }

    private ObjectNode error(ObjectNode response, int code, String message) {
        ObjectNode error = objectMapper.createObjectNode();
        error.put("code", code);
        error.put("message", message);
        response.set("error", error);
        return response;
    }

    private static String text(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return v == null || v.isNull() ? null : v.asText();
    }
}

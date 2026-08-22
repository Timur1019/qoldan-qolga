package com.test.qoldanqolga.service.payment.click;

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
import org.springframework.util.DigestUtils;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClickMerchantService {

    private final PaymentProperties paymentProperties;
    private final PromoOrderRepository promoOrderRepository;
    private final PromoActivationService promoActivationService;
    private final PaymentNotificationPublisher paymentNotificationPublisher;

    @Transactional
    public Map<String, Object> prepare(Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (!verifySign(params, true)) {
                return clickError(-1, "Invalid sign");
            }
            String orderId = params.get("merchant_trans_id");
            PromoOrder order = promoOrderRepository.findById(orderId).orElse(null);
            if (order == null) {
                return clickError(-5, "Order not found");
            }
            if (PromoOrderStatus.PAID.equals(order.getStatus())) {
                return clickError(-4, "Already paid");
            }
            BigDecimal amount = new BigDecimal(params.getOrDefault("amount", "0"));
            if (order.getAmount().compareTo(amount) != 0) {
                return clickError(-2, "Incorrect amount");
            }
            result.put("click_trans_id", params.get("click_trans_id"));
            result.put("merchant_trans_id", orderId);
            result.put("merchant_prepare_id", order.getId().hashCode() & 0x7fffffff);
            result.put("error", 0);
            result.put("error_note", "Success");
            return result;
        } catch (Exception e) {
            LogUtil.error(ClickMerchantService.class, "Click prepare error: {}", e.getMessage());
            return clickError(-9, "Error");
        }
    }

    @Transactional
    public Map<String, Object> complete(Map<String, String> params) {
        try {
            if (!verifySign(params, false)) {
                return clickError(-1, "Invalid sign");
            }
            int error = Integer.parseInt(params.getOrDefault("error", "0"));
            String orderId = params.get("merchant_trans_id");
            PromoOrder order = promoOrderRepository.findById(orderId).orElse(null);
            if (order == null) {
                return clickError(-5, "Order not found");
            }
            if (error < 0) {
                if (!PromoOrderStatus.PAID.equals(order.getStatus())) {
                    order.setStatus(PromoOrderStatus.CANCELLED);
                    promoOrderRepository.save(order);
                    paymentNotificationPublisher.publishFailed(order);
                }
                Map<String, Object> result = new HashMap<>();
                result.put("click_trans_id", params.get("click_trans_id"));
                result.put("merchant_trans_id", orderId);
                result.put("merchant_confirm_id", order.getId().hashCode() & 0x7fffffff);
                result.put("error", -9);
                result.put("error_note", "Cancelled");
                return result;
            }
            String clickTransId = params.get("click_trans_id");
            if (clickTransId != null) {
                order.setProviderTxnId(clickTransId);
            }
            promoActivationService.activatePaidOrder(order);
            Map<String, Object> result = new HashMap<>();
            result.put("click_trans_id", clickTransId);
            result.put("merchant_trans_id", orderId);
            result.put("merchant_confirm_id", order.getId().hashCode() & 0x7fffffff);
            result.put("error", 0);
            result.put("error_note", "Success");
            return result;
        } catch (Exception e) {
            LogUtil.error(ClickMerchantService.class, "Click complete error: {}", e.getMessage());
            return clickError(-9, "Error");
        }
    }

    private boolean verifySign(Map<String, String> params, boolean prepare) {
        if (paymentProperties.isMock()) {
            return true;
        }
        String secret = paymentProperties.getClick().getSecretKey();
        if (secret == null || secret.isBlank()) {
            return false;
        }
        String clickTransId = params.getOrDefault("click_trans_id", "");
        String serviceId = params.getOrDefault("service_id", "");
        String merchantTransId = params.getOrDefault("merchant_trans_id", "");
        String amount = params.getOrDefault("amount", "");
        String action = params.getOrDefault("action", "");
        String signTime = params.getOrDefault("sign_time", "");
        String signString = params.getOrDefault("sign_string", "");

        String raw;
        if (prepare) {
            raw = clickTransId + serviceId + secret + merchantTransId + amount + action + signTime;
        } else {
            String merchantPrepareId = params.getOrDefault("merchant_prepare_id", "");
            raw = clickTransId + serviceId + secret + merchantTransId + merchantPrepareId + amount + action + signTime;
        }
        String expected = DigestUtils.md5DigestAsHex(raw.getBytes(StandardCharsets.UTF_8));
        return expected.equalsIgnoreCase(signString);
    }

    private Map<String, Object> clickError(int code, String note) {
        Map<String, Object> result = new HashMap<>();
        result.put("error", code);
        result.put("error_note", note);
        return result;
    }
}

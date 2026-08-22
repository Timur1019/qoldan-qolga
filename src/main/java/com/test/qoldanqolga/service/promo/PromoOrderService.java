package com.test.qoldanqolga.service.promo;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.dto.promo.PromoOrderResponse;
import com.test.qoldanqolga.exception.AdAccessDeniedException;
import com.test.qoldanqolga.exception.AdvertisementNotActiveException;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.exception.ValidationException;
import java.util.List;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.PaymentProvider;
import com.test.qoldanqolga.model.PromoOrder;
import com.test.qoldanqolga.model.PromoOrderStatus;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.PromoOrderRepository;
import com.test.qoldanqolga.service.payment.PaymentGateway;
import com.test.qoldanqolga.service.payment.PaymentGatewayResolver;
import com.test.qoldanqolga.service.notification.PaymentNotificationPublisher;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PromoOrderService {

    private final AdvertisementRepository advertisementRepository;
    private final PromoOrderRepository promoOrderRepository;
    private final PromoCatalogue promoCatalogue;
    private final PaymentGatewayResolver paymentGatewayResolver;
    private final PaymentNotificationPublisher paymentNotificationPublisher;

    @Transactional
    public PromoOrderResponse createOrder(String adId, String serviceCode, String provider, String userId) {
        Advertisement ad = advertisementRepository.findById(adId)
                .orElseThrow(() -> new ResourceNotFoundException("Объявление", adId));

        validateOwnership(ad, userId);
        validateAdvertisementActive(ad);

        PromoProperties.PromoServiceConfig plan = promoCatalogue.require(serviceCode);
        String normalizedProvider = PaymentProvider.normalize(provider);
        if (normalizedProvider == null) {
            throw new ValidationException(List.of("Способ оплаты: укажите PAYME или CLICK"));
        }

        PaymentGateway gateway = paymentGatewayResolver.resolve(normalizedProvider);

        PromoOrder order = new PromoOrder();
        order.setAdId(ad.getId());
        order.setUserId(userId);
        order.setServiceCode(plan.getCode());
        order.setAmount(plan.getPrice());
        order.setCurrency("UZS");
        order.setStatus(PromoOrderStatus.PENDING);
        order.setProvider(normalizedProvider);
        promoOrderRepository.save(order);

        String paymentUrl = gateway.createCheckout(order);
        order.setPaymentUrl(paymentUrl);
        promoOrderRepository.save(order);

        paymentNotificationPublisher.publishPending(order);

        LogUtil.info(PromoOrderService.class,
                "Promo order created: orderId={} adId={} service={} provider={} amount={}",
                order.getId(), adId, plan.getCode(), normalizedProvider, plan.getPrice());

        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public PromoOrderResponse getOrderForUser(String orderId, String userId) {
        PromoOrder order = promoOrderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Заказ промо", orderId));
        return toResponse(order);
    }

    private PromoOrderResponse toResponse(PromoOrder order) {
        return new PromoOrderResponse(
                order.getId(),
                order.getPaymentUrl(),
                order.getAmount(),
                order.getCurrency(),
                order.getStatus(),
                order.getProvider(),
                order.getServiceCode()
        );
    }

    private void validateOwnership(Advertisement ad, String userId) {
        if (!ad.getUserId().equals(userId)) {
            throw new AdAccessDeniedException(ad.getId(), userId);
        }
    }

    private void validateAdvertisementActive(Advertisement ad) {
        if (!AdConstants.STATUS_ACTIVE.equals(ad.getStatus())) {
            throw new AdvertisementNotActiveException(ad.getId());
        }
    }
}

package com.test.qoldanqolga.service.notification;

import com.test.qoldanqolga.dto.notification.NotificationEvent;
import com.test.qoldanqolga.model.Advertisement;
import com.test.qoldanqolga.model.PromoOrder;
import com.test.qoldanqolga.notification.NotificationEntityType;
import com.test.qoldanqolga.notification.NotificationType;

import java.util.Map;

public final class NotificationEventFactory {

    private NotificationEventFactory() {
    }

    public static NotificationEvent favoriteAdded(String ownerId, Advertisement ad, String favoritedByUserId) {
        String title = ad.getTitle() != null ? ad.getTitle().trim() : "Объявление";
        return NotificationEvent.builder()
                .type(NotificationType.FAVORITE_ADDED)
                .recipientUserId(ownerId)
                .title("Новое избранное")
                .body("Ваше объявление «" + clip(title, 60) + "» добавили в избранное")
                .entityType(NotificationEntityType.AD)
                .entityId(ad.getId())
                .payload(Map.of("adId", ad.getId(), "favoritedByUserId", favoritedByUserId))
                .build();
    }

    public static NotificationEvent adPublished(String ownerId, Advertisement ad) {
        String title = ad.getTitle() != null ? ad.getTitle().trim() : "Объявление";
        return NotificationEvent.builder()
                .type(NotificationType.AD_PUBLISHED)
                .recipientUserId(ownerId)
                .title("Объявление опубликовано")
                .body("Ваше объявление «" + clip(title, 60) + "» успешно опубликовано")
                .entityType(NotificationEntityType.AD)
                .entityId(ad.getId())
                .build();
    }

    public static NotificationEvent adHidden(String ownerId, Advertisement ad) {
        String title = ad.getTitle() != null ? ad.getTitle().trim() : "Объявление";
        return NotificationEvent.builder()
                .type(NotificationType.AD_HIDDEN)
                .recipientUserId(ownerId)
                .title("Объявление скрыто")
                .body("Объявление «" + clip(title, 60) + "» перемещено в архив")
                .entityType(NotificationEntityType.AD)
                .entityId(ad.getId())
                .build();
    }

    public static NotificationEvent adExpiring(String ownerId, Advertisement ad) {
        String title = ad.getTitle() != null ? ad.getTitle().trim() : "Объявление";
        return NotificationEvent.builder()
                .type(NotificationType.AD_EXPIRING)
                .recipientUserId(ownerId)
                .title("Объявление скоро закончится")
                .body("Срок публикации «" + clip(title, 60) + "» истекает завтра")
                .entityType(NotificationEntityType.AD)
                .entityId(ad.getId())
                .build();
    }

    public static NotificationEvent adExpired(String ownerId, Advertisement ad) {
        String title = ad.getTitle() != null ? ad.getTitle().trim() : "Объявление";
        return NotificationEvent.builder()
                .type(NotificationType.AD_EXPIRED)
                .recipientUserId(ownerId)
                .title("Объявление истекло")
                .body("Срок публикации «" + clip(title, 60) + "» истёк. Продлите или опубликуйте снова")
                .entityType(NotificationEntityType.AD)
                .entityId(ad.getId())
                .build();
    }

    public static NotificationEvent promotionExpiring(String ownerId, Advertisement ad) {
        String title = ad.getTitle() != null ? ad.getTitle().trim() : "Объявление";
        return NotificationEvent.builder()
                .type(NotificationType.PROMOTION_EXPIRING)
                .recipientUserId(ownerId)
                .title("Продвижение заканчивается")
                .body("Продвижение «" + clip(title, 60) + "» завершится завтра")
                .entityType(NotificationEntityType.AD)
                .entityId(ad.getId())
                .build();
    }

    public static NotificationEvent promotionExpired(String ownerId, Advertisement ad) {
        String title = ad.getTitle() != null ? ad.getTitle().trim() : "Объявление";
        return NotificationEvent.builder()
                .type(NotificationType.PROMOTION_EXPIRED)
                .recipientUserId(ownerId)
                .title("Продвижение завершено")
                .body("Продвижение «" + clip(title, 60) + "» больше не активно")
                .entityType(NotificationEntityType.AD)
                .entityId(ad.getId())
                .build();
    }

    public static NotificationEvent promotionActive(String ownerId, String adId, String planName) {
        return NotificationEvent.builder()
                .type(NotificationType.PROMOTION_ACTIVE)
                .recipientUserId(ownerId)
                .title("Продвижение включено")
                .body("Тариф «" + planName + "» активирован для объявления")
                .entityType(NotificationEntityType.AD)
                .entityId(adId)
                .build();
    }

    public static NotificationEvent paymentPending(PromoOrder order) {
        return NotificationEvent.builder()
                .type(NotificationType.PAYMENT_PENDING)
                .recipientUserId(order.getUserId())
                .title("Ожидает оплаты")
                .body("Завершите оплату продвижения на сумму " + order.getAmount() + " " + order.getCurrency())
                .entityType(NotificationEntityType.PAYMENT)
                .entityId(order.getId())
                .payload(Map.of("orderId", order.getId(), "adId", order.getAdId()))
                .build();
    }

    public static NotificationEvent paymentSuccess(PromoOrder order) {
        return NotificationEvent.builder()
                .type(NotificationType.PAYMENT_SUCCESS)
                .recipientUserId(order.getUserId())
                .title("Оплата прошла")
                .body("Платёж на сумму " + order.getAmount() + " " + order.getCurrency() + " успешно проведён")
                .entityType(NotificationEntityType.PAYMENT)
                .entityId(order.getId())
                .payload(Map.of("orderId", order.getId(), "adId", order.getAdId()))
                .build();
    }

    public static NotificationEvent promotionPaid(PromoOrder order) {
        return NotificationEvent.builder()
                .type(NotificationType.PROMOTION_PAID)
                .recipientUserId(order.getUserId())
                .title("Продвижение оплачено")
                .body("Тариф «" + order.getServiceCode() + "» оплачен и активируется")
                .entityType(NotificationEntityType.PAYMENT)
                .entityId(order.getId())
                .payload(Map.of("orderId", order.getId(), "adId", order.getAdId()))
                .build();
    }

    public static NotificationEvent paymentFailed(PromoOrder order) {
        return NotificationEvent.builder()
                .type(NotificationType.PAYMENT_FAILED)
                .recipientUserId(order.getUserId())
                .title("Не удалось провести оплату")
                .body("Попробуйте оплатить продвижение ещё раз")
                .entityType(NotificationEntityType.PAYMENT)
                .entityId(order.getId())
                .payload(Map.of("orderId", order.getId(), "adId", order.getAdId()))
                .build();
    }

    public static NotificationEvent newLogin(String userId) {
        return NotificationEvent.builder()
                .type(NotificationType.NEW_LOGIN)
                .recipientUserId(userId)
                .title("Новый вход в аккаунт")
                .body("Выполнен вход в ваш аккаунт")
                .entityType(NotificationEntityType.USER)
                .entityId(userId)
                .build();
    }

    public static NotificationEvent newDeviceLogin(String userId, String deviceId) {
        return NotificationEvent.builder()
                .type(NotificationType.NEW_DEVICE_LOGIN)
                .recipientUserId(userId)
                .title("Вход с нового устройства")
                .body("Выполнен вход с нового устройства")
                .entityType(NotificationEntityType.USER)
                .entityId(userId)
                .payload(Map.of("deviceId", deviceId != null ? deviceId : ""))
                .build();
    }

    private static String clip(String text, int max) {
        if (text == null || text.isBlank()) {
            return text;
        }
        String trimmed = text.trim();
        if (trimmed.length() <= max) {
            return trimmed;
        }
        return trimmed.substring(0, max - 1) + "…";
    }
}

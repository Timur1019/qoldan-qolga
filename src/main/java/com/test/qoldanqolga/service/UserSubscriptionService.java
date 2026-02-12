package com.test.qoldanqolga.service;

/**
 * Подписки пользователей друг на друга.
 */
public interface UserSubscriptionService {

    void subscribe(String subscriberId, String subscribedToId);

    void unsubscribe(String subscriberId, String subscribedToId);

    boolean toggle(String subscriberId, String subscribedToId);

    boolean isSubscribed(String subscriberId, String subscribedToId);
}

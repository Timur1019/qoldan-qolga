package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.exception.SelfSubscriptionException;
import com.test.qoldanqolga.model.User;
import com.test.qoldanqolga.model.UserSubscription;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.repository.UserSubscriptionRepository;
import com.test.qoldanqolga.service.UserSubscriptionService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserSubscriptionServiceImpl implements UserSubscriptionService {

    private final UserSubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void subscribe(String subscriberId, String subscribedToId) {
        if (subscriberId.equals(subscribedToId)) {
            throw new SelfSubscriptionException(subscriberId);
        }
        if (!userRepository.existsById(subscriberId)) {
            throw new ResourceNotFoundException("Подписчик", subscriberId);
        }
        User subscribedTo = userRepository.findById(subscribedToId)
                .orElseThrow(() -> new ResourceNotFoundException("Продавец", subscribedToId));
        if (subscribedTo.isDeleted()) {
            throw new ResourceNotFoundException("Продавец", subscribedToId);
        }
        if (subscriptionRepository.existsBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId)) {
            LogUtil.debug(UserSubscriptionServiceImpl.class, "Already subscribed: subscriber={} subscribedTo={}", subscriberId, subscribedToId);
            return;
        }
        UserSubscription sub = new UserSubscription(subscriberId, subscribedToId);
        subscriptionRepository.save(sub);
        LogUtil.info(UserSubscriptionServiceImpl.class, "User {} subscribed to user {}", subscriberId, subscribedToId);
    }

    @Override
    @Transactional
    public void unsubscribe(String subscriberId, String subscribedToId) {
        subscriptionRepository.deleteBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId);
        LogUtil.info(UserSubscriptionServiceImpl.class, "User {} unsubscribed from user {}", subscriberId, subscribedToId);
    }

    @Override
    @Transactional
    public boolean toggle(String subscriberId, String subscribedToId) {
        if (subscriberId.equals(subscribedToId)) {
            throw new SelfSubscriptionException(subscriberId);
        }
        boolean exists = subscriptionRepository.existsBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId);
        if (exists) {
            unsubscribe(subscriberId, subscribedToId);
            LogUtil.debug(UserSubscriptionServiceImpl.class, "Subscribe toggled off: subscriber={} subscribedTo={}", subscriberId, subscribedToId);
            return false;
        }
        subscribe(subscriberId, subscribedToId);
        LogUtil.debug(UserSubscriptionServiceImpl.class, "Subscribe toggled on: subscriber={} subscribedTo={}", subscriberId, subscribedToId);
        return true;
    }

    @Override
    public boolean isSubscribed(String subscriberId, String subscribedToId) {
        return subscriberId != null
                && subscriptionRepository.existsBySubscriberIdAndSubscribedToId(subscriberId, subscribedToId);
    }
}

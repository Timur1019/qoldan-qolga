package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.UserSubscription;
import com.test.qoldanqolga.model.UserSubscriptionId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, UserSubscriptionId> {

    boolean existsBySubscriberIdAndSubscribedToId(String subscriberId, String subscribedToId);

    void deleteBySubscriberIdAndSubscribedToId(String subscriberId, String subscribedToId);

    long countBySubscribedToId(String subscribedToId);
}

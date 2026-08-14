package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.UserSubscription;
import com.test.qoldanqolga.model.UserSubscriptionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, UserSubscriptionId> {

    boolean existsBySubscriberIdAndSubscribedToId(String subscriberId, String subscribedToId);

    void deleteBySubscriberIdAndSubscribedToId(String subscriberId, String subscribedToId);

    long countBySubscribedToId(String subscribedToId);

    @Query("select s.subscribedToId from UserSubscription s where s.subscriberId = :subscriberId")
    List<String> findSubscribedToIdsBySubscriberId(@Param("subscriberId") String subscriberId);
}

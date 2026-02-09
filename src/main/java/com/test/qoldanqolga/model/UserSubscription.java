package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_subscriptions")
@IdClass(UserSubscriptionId.class)
@Getter
@Setter
public class UserSubscription {

    @Id
    @Column(name = "subscriber_id", nullable = false, length = 36)
    private String subscriberId;

    @Id
    @Column(name = "subscribed_to_id", nullable = false, length = 36)
    private String subscribedToId;
}

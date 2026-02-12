package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_subscriptions", indexes = {
        @Index(name = "idx_user_subs_subscribed_to", columnList = "subscribed_to_id")
})
@IdClass(UserSubscriptionId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscription {

    @Id
    @Column(name = "subscriber_id", nullable = false, length = 36)
    private String subscriberId;

    @Id
    @Column(name = "subscribed_to_id", nullable = false, length = 36)
    private String subscribedToId;
}

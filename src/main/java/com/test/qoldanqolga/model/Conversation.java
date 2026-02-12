package com.test.qoldanqolga.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations", indexes = {
        @Index(name = "idx_conv_ad_id", columnList = "ad_id"),
        @Index(name = "idx_conv_buyer_id", columnList = "buyer_id")
})
@Getter
@Setter
public class Conversation extends BaseEntity {

    @Column(name = "ad_id", nullable = false, length = 36)
    private String adId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ad_id", insertable = false, updatable = false)
    private Advertisement ad;

    @Column(name = "buyer_id", nullable = false, length = 36)
    private String buyerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", insertable = false, updatable = false)
    private User buyer;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<ChatMessage> messages = new ArrayList<>();
}

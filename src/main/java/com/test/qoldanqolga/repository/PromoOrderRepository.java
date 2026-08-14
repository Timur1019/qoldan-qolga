package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.PromoOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromoOrderRepository extends JpaRepository<PromoOrder, String> {

    Optional<PromoOrder> findByIdAndUserId(String id, String userId);

    Optional<PromoOrder> findByProviderTxnId(String providerTxnId);
}

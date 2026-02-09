package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, String> {

    @Query("SELECT c FROM Conversation c LEFT JOIN FETCH c.ad LEFT JOIN FETCH c.buyer WHERE c.adId = :adId AND c.buyerId = :buyerId")
    Optional<Conversation> findByAdIdAndBuyerIdWithAdAndBuyer(@Param("adId") Long adId, @Param("buyerId") String buyerId);

    default Optional<Conversation> findByAdIdAndBuyerId(Long adId, String buyerId) {
        return findByAdIdAndBuyerIdWithAdAndBuyer(adId, buyerId);
    }

    @Query("SELECT DISTINCT c FROM Conversation c LEFT JOIN FETCH c.ad LEFT JOIN FETCH c.buyer WHERE c.buyerId = :userId OR c.ad.userId = :userId ORDER BY c.createdAt DESC")
    List<Conversation> findAllByParticipant(@Param("userId") String userId);
}

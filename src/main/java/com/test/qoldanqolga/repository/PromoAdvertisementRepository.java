package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface PromoAdvertisementRepository extends JpaRepository<Advertisement, String> {

    @Query("SELECT a FROM Advertisement a WHERE a.nextBoostAt IS NOT NULL AND a.nextBoostAt <= :now "
            + "AND a.promoUntil IS NOT NULL AND a.promoUntil > :now AND a.deletedAt IS NULL")
    List<Advertisement> findDueForBoost(@Param("now") Instant now);

    @Query("SELECT a FROM Advertisement a WHERE a.promoUntil IS NOT NULL AND a.promoUntil <= :now "
            + "AND (a.isVip = true OR a.isTop = true OR a.isHighlighted = true OR a.promoPriority > 0) "
            + "AND a.deletedAt IS NULL")
    List<Advertisement> findExpiredPromo(@Param("now") Instant now);

    @Query("SELECT a FROM Advertisement a WHERE a.promoUntil IS NOT NULL "
            + "AND a.promoUntil > :from AND a.promoUntil <= :to "
            + "AND (a.isVip = true OR a.isTop = true OR a.isHighlighted = true OR a.promoPriority > 0) "
            + "AND a.deletedAt IS NULL")
    List<Advertisement> findPromoExpiringBetween(@Param("from") Instant from, @Param("to") Instant to);

    @Modifying
    @Query("UPDATE Advertisement a SET a.isVip = false, a.isTop = false, a.isHighlighted = false, "
            + "a.promoPriority = 0, a.boostIntervalHours = null, a.nextBoostAt = null "
            + "WHERE a.id = :id")
    int clearPromoFlags(@Param("id") String id);
}

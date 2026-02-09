package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.AdImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdImageRepository extends JpaRepository<AdImage, Long> {

    List<AdImage> findByAdIdOrderByOrderNumAscIdAsc(Long adId);

    @Modifying
    @Query("DELETE FROM AdImage i WHERE i.adId = :adId")
    void deleteByAdId(@Param("adId") Long adId);
}

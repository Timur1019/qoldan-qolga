package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Advertisement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    Page<Advertisement> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    @Query("SELECT a FROM Advertisement a WHERE a.status = :status " +
           "AND (:category IS NULL OR :category = '' OR a.category = :category) " +
           "AND (:region IS NULL OR :region = '' OR a.region = :region) ORDER BY a.createdAt DESC")
    Page<Advertisement> findByStatusAndCategoryAndRegionOrderByCreatedAtDesc(
            @Param("status") String status,
            @Param("category") String category,
            @Param("region") String region,
            Pageable pageable);

    Page<Advertisement> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    @Query("SELECT a FROM Advertisement a LEFT JOIN FETCH a.user LEFT JOIN FETCH a.images WHERE a.id = :id")
    Optional<Advertisement> findByIdWithUserAndImages(Long id);

    @Query("SELECT DISTINCT a FROM Advertisement a LEFT JOIN FETCH a.images WHERE a.id IN :ids")
    List<Advertisement> findByIdInWithImages(@Param("ids") Collection<Long> ids);

    @Modifying
    @Query("UPDATE Advertisement a SET a.views = a.views + 1 WHERE a.id = :adId")
    int incrementViews(Long adId);
}

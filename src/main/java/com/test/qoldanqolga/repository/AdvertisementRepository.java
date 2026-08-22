package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Advertisement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AdvertisementRepository extends JpaRepository<Advertisement, String>, JpaSpecificationExecutor<Advertisement> {

    Page<Advertisement> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    @Query("SELECT a FROM Advertisement a WHERE a.status = :status " +
           "AND (:category IS NULL OR :category = '' OR a.category = :category) " +
           "AND (:region IS NULL OR :region = '' OR a.region = :region) " +
           "AND (:q IS NULL OR :q = '' OR LOWER(a.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "ORDER BY a.createdAt DESC")
    Page<Advertisement> findByStatusAndCategoryAndRegionAndQueryOrderByCreatedAtDesc(
            @Param("status") String status,
            @Param("category") String category,
            @Param("region") String region,
            @Param("q") String q,
            Pageable pageable);

    @Query("SELECT a FROM Advertisement a WHERE a.status = :status " +
           "AND a.category IN :categories " +
           "AND (:region IS NULL OR :region = '' OR a.region = :region) " +
           "AND (:q IS NULL OR :q = '' OR LOWER(a.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "ORDER BY a.createdAt DESC")
    Page<Advertisement> findByStatusAndCategoryInAndRegionAndQueryOrderByCreatedAtDesc(
            @Param("status") String status,
            @Param("categories") List<String> categories,
            @Param("region") String region,
            @Param("q") String q,
            Pageable pageable);

    Page<Advertisement> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    long countByUserIdAndStatus(String userId, String status);

    long countByDeletedAtIsNullAndStatus(String status);

    long countByDeletedAtIsNullAndCreatedAtGreaterThanEqual(Instant from);

    Page<Advertisement> findByDeletedAtIsNullAndCreatedAtGreaterThanEqual(Instant from, Pageable pageable);

    Page<Advertisement> findByDeletedAtIsNullAndStatus(String status, Pageable pageable);

    @Query("SELECT a FROM Advertisement a LEFT JOIN FETCH a.user LEFT JOIN FETCH a.images LEFT JOIN FETCH a.brand LEFT JOIN FETCH a.vehicleModel WHERE a.id = :id")
    Optional<Advertisement> findByIdWithUserAndImages(String id);

    @Query("SELECT DISTINCT a FROM Advertisement a LEFT JOIN FETCH a.images WHERE a.id IN :ids")
    List<Advertisement> findByIdInWithImages(@Param("ids") Collection<String> ids);

    @Modifying
    @Query("UPDATE Advertisement a SET a.views = a.views + 1 WHERE a.id = :adId")
    int incrementViews(String adId);

    /**
     * Курсорная пагинация: выборка записей с id больше курсора.
     * Строгая сортировка ORDER BY id ASC для стабильности курсора.
     */
    @Query("SELECT a FROM Advertisement a WHERE a.status = :status " +
           "AND (:cursor IS NULL OR a.id > :cursor) " +
           "AND (:excludeAdId IS NULL OR :excludeAdId = '' OR a.id <> :excludeAdId) " +
           "ORDER BY a.id ASC")
    List<Advertisement> findByCursor(
            @Param("status") String status,
            @Param("cursor") String cursor,
            @Param("excludeAdId") String excludeAdId,
            Pageable pageable);

    @Query("SELECT a.brandId, COUNT(a) FROM Advertisement a " +
           "WHERE a.status = :status " +
           "AND a.deletedAt IS NULL " +
           "AND a.brandId IN :brandIds " +
           "AND a.category IN :categories " +
           "GROUP BY a.brandId")
    List<Object[]> countActiveByBrandIdInAndCategoryIn(
            @Param("status") String status,
            @Param("brandIds") Collection<String> brandIds,
            @Param("categories") Collection<String> categories);

    @Query("SELECT a FROM Advertisement a WHERE a.status = 'ACTIVE' AND a.deletedAt IS NULL "
            + "AND a.expiresAt > :from AND a.expiresAt <= :to")
    List<Advertisement> findExpiringBetween(@Param("from") Instant from, @Param("to") Instant to);

    @Query("SELECT a FROM Advertisement a WHERE a.status = 'ACTIVE' AND a.deletedAt IS NULL "
            + "AND a.expiresAt <= :now")
    List<Advertisement> findExpiredActive(@Param("now") Instant now);
}

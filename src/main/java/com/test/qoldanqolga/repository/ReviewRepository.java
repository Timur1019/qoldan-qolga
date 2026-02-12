package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.dto.user.ReviewStatisticsDto;
import com.test.qoldanqolga.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {

    @Query(value = "SELECT DISTINCT r FROM Review r " +
           "LEFT JOIN FETCH r.author LEFT JOIN FETCH r.targetUser " +
           "WHERE r.targetUserId = :targetUserId ORDER BY r.createdAt DESC",
           countQuery = "SELECT COUNT(r) FROM Review r WHERE r.targetUserId = :targetUserId")
    Page<Review> findByTargetUserIdWithUsers(@Param("targetUserId") String targetUserId, Pageable pageable);

    @Query(value = "SELECT DISTINCT r FROM Review r " +
           "LEFT JOIN FETCH r.author LEFT JOIN FETCH r.targetUser " +
           "WHERE r.authorId = :authorId ORDER BY r.createdAt DESC",
           countQuery = "SELECT COUNT(r) FROM Review r WHERE r.authorId = :authorId")
    Page<Review> findByAuthorIdWithUsers(@Param("authorId") String authorId, Pageable pageable);

    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.author LEFT JOIN FETCH r.targetUser WHERE r.id = :id")
    java.util.Optional<Review> findByIdWithUsers(@Param("id") String id);

    @Query("SELECT new com.test.qoldanqolga.dto.user.ReviewStatisticsDto(" +
           "COALESCE(AVG(r.rating), 0), " +
           "COUNT(r), " +
           "COALESCE(SUM(CASE WHEN r.rating = 5 THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN r.rating = 4 THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN r.rating = 3 THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN r.rating = 2 THEN 1L ELSE 0L END), 0L), " +
           "COALESCE(SUM(CASE WHEN r.rating = 1 THEN 1L ELSE 0L END), 0L)) " +
           "FROM Review r WHERE r.targetUserId = :userId")
    ReviewStatisticsDto getStatistics(@Param("userId") String userId);

    @Query("SELECT COUNT(r) > 0 FROM Review r " +
           "WHERE r.authorId = :authorId AND r.targetUserId = :targetUserId " +
           "AND (:adId IS NULL OR r.adId = :adId)")
    boolean existsByAuthorAndTarget(@Param("authorId") String authorId,
                                    @Param("targetUserId") String targetUserId,
                                    @Param("adId") String adId);

    @Query("SELECT r.targetUserId, AVG(r.rating), COUNT(r) FROM Review r WHERE r.targetUserId IN :userIds GROUP BY r.targetUserId")
    List<Object[]> findAverageAndCountByTargetUserIdIn(@Param("userIds") List<String> userIds);
}

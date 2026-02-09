package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {

    @Query(value = "SELECT r FROM Review r LEFT JOIN FETCH r.author WHERE r.targetUserId = :targetUserId ORDER BY r.createdAt DESC",
           countQuery = "SELECT COUNT(r) FROM Review r WHERE r.targetUserId = :targetUserId")
    Page<Review> findByTargetUserIdOrderByCreatedAtDesc(@Param("targetUserId") String targetUserId, Pageable pageable);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.targetUserId = :userId GROUP BY r.rating")
    List<Object[]> countByRatingForUser(@Param("userId") String userId);

    @Query(value = "SELECT DISTINCT r FROM Review r LEFT JOIN FETCH r.targetUser WHERE r.authorId = :authorId ORDER BY r.createdAt DESC",
           countQuery = "SELECT COUNT(r) FROM Review r WHERE r.authorId = :authorId")
    Page<Review> findByAuthorIdOrderByCreatedAtDesc(@Param("authorId") String authorId, Pageable pageable);

    boolean existsByAuthorIdAndTargetUserIdAndAdId(String authorId, String targetUserId, Long adId);

    boolean existsByAuthorIdAndTargetUserId(String authorId, String targetUserId);
}

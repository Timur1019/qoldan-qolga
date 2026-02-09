package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    boolean existsByUserIdAndAdvertisementId(String userId, Long advertisementId);

    Optional<Favorite> findByUserIdAndAdvertisementId(String userId, Long advertisementId);

    void deleteByUserIdAndAdvertisementId(String userId, Long advertisementId);

    void deleteByAdvertisementId(Long advertisementId);

    Page<Favorite> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    @Query("SELECT f.advertisementId FROM Favorite f WHERE f.userId = :userId")
    List<Long> findAdvertisementIdsByUserId(@Param("userId") String userId);
}

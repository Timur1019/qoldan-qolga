package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByPhone(String phone);

    long countByProfileVerifiedTrue();

    long countByVerificationRequestedAtNotNullAndProfileVerifiedFalse();

    long countByDeletedAtIsNull();

    long countByDeletedAtIsNullAndCreatedAtGreaterThanEqual(Instant from);

    long countByDeletedAtIsNullAndLastSeenAtGreaterThanEqual(Instant from);

    @Query(value = """
            SELECT COUNT(*) FROM users
            WHERE deleted_at IS NULL
              AND COALESCE(last_seen_at, created_at) < :cutoff
            """, nativeQuery = true)
    long countInactiveSince(@Param("cutoff") Instant cutoff);

    @Query(value = """
            SELECT CAST((created_at AT TIME ZONE 'Asia/Tashkent') AS date) AS day, COUNT(*)
            FROM users
            WHERE deleted_at IS NULL AND created_at >= :from
            GROUP BY day
            ORDER BY day
            """, nativeQuery = true)
    List<Object[]> countRegistrationsByDay(@Param("from") Instant from);

    @Query(value = """
            SELECT CAST((last_seen_at AT TIME ZONE 'Asia/Tashkent') AS date) AS day, COUNT(*)
            FROM users
            WHERE deleted_at IS NULL AND last_seen_at >= :from
            GROUP BY day
            ORDER BY day
            """, nativeQuery = true)
    List<Object[]> countActiveByDay(@Param("from") Instant from);

    Page<User> findByDeletedAtIsNull(Pageable pageable);

    Page<User> findByDeletedAtIsNullAndCreatedAtGreaterThanEqual(Instant from, Pageable pageable);

    Page<User> findByDeletedAtIsNullAndLastSeenAtGreaterThanEqual(Instant from, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL AND coalesce(u.lastSeenAt, u.createdAt) < :cutoff")
    Page<User> findInactiveSince(@Param("cutoff") Instant cutoff, Pageable pageable);
}

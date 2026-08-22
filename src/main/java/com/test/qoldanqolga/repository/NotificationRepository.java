package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    Page<Notification> findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(String userId, Pageable pageable);

    long countByUserIdAndIsReadFalseAndDeletedAtIsNull(String userId);

    Optional<Notification> findFirstByUserIdAndGroupKeyAndIsReadFalseAndDeletedAtIsNullAndCreatedAtAfterOrderByCreatedAtDesc(
            String userId,
            String groupKey,
            Instant after
    );

    @Modifying
    @Query("""
            UPDATE Notification n SET n.isRead = true, n.readAt = :now
            WHERE n.userId = :userId AND n.id IN :ids AND n.deletedAt IS NULL
            """)
    int markRead(@Param("userId") String userId, @Param("ids") Iterable<String> ids, @Param("now") Instant now);

    @Modifying
    @Query("""
            UPDATE Notification n SET n.isRead = true, n.readAt = :now
            WHERE n.userId = :userId AND n.isRead = false AND n.deletedAt IS NULL
            """)
    int markAllRead(@Param("userId") String userId, @Param("now") Instant now);

    boolean existsByUserIdAndTypeAndEntityIdAndCreatedAtAfterAndDeletedAtIsNull(
            String userId,
            com.test.qoldanqolga.notification.NotificationType type,
            String entityId,
            Instant since
    );
}

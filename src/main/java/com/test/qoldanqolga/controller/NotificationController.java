package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.notification.MarkNotificationsReadRequest;
import com.test.qoldanqolga.dto.notification.NotificationDto;
import com.test.qoldanqolga.dto.notification.NotificationPreferenceDto;
import com.test.qoldanqolga.service.notification.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Уведомления", description = "Центр уведомлений и настройки")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Список уведомлений", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping
    public ResponseEntity<Page<NotificationDto>> inbox(
            @AuthenticationPrincipal UserDetails user,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(notificationService.getInbox(user.getUsername(), pageable));
    }

    @Operation(summary = "Количество непрочитанных", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getUsername())));
    }

    @Operation(summary = "Отметить прочитанными", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/read")
    public ResponseEntity<Void> markRead(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody MarkNotificationsReadRequest request
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        if (request.getIds() != null && !request.getIds().isEmpty()) {
            notificationService.markRead(user.getUsername(), request.getIds());
        }
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Отметить все прочитанными", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllRead(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAllRead(user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Настройки уведомлений", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/preferences")
    public ResponseEntity<NotificationPreferenceDto> getPreferences(@AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(notificationService.getPreferences(user.getUsername()));
    }

    @Operation(summary = "Обновить настройки уведомлений", security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/preferences")
    public ResponseEntity<NotificationPreferenceDto> updatePreferences(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody NotificationPreferenceDto request
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(notificationService.updatePreferences(user.getUsername(), request));
    }
}

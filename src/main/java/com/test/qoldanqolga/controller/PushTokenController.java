package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.push.RegisterPushTokenRequest;
import com.test.qoldanqolga.service.push.PushTokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
public class PushTokenController {

    private final PushTokenService pushTokenService;

    @Operation(summary = "Зарегистрировать Expo push-токен", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/token")
    public ResponseEntity<Void> register(
            @Valid @RequestBody RegisterPushTokenRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        pushTokenService.register(user.getUsername(), request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Удалить push-токен", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/token")
    public ResponseEntity<Void> unregister(
            @RequestParam String token,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        pushTokenService.unregister(user.getUsername(), token);
        return ResponseEntity.noContent().build();
    }
}

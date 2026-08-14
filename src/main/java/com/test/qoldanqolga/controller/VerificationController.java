package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.auth.CompleteVerificationRequest;
import com.test.qoldanqolga.dto.auth.CompleteVerificationResponse;
import com.test.qoldanqolga.dto.auth.StartVerificationRequest;
import com.test.qoldanqolga.dto.auth.StartVerificationResponse;
import com.test.qoldanqolga.service.VerificationService;
import com.test.qoldanqolga.util.ClientIpResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/verification")
@Tag(name = "Verification", description = "Подтверждение личности через MyID")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @Operation(summary = "Начать проверку ID через MyID WebSDK", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Сессия создана, нужен редирект"),
            @ApiResponse(responseCode = "400", description = "Ошибка валидации или MyID"),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    @PostMapping("/start")
    public ResponseEntity<StartVerificationResponse> start(
            @Valid @RequestBody StartVerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletRequest httpRequest
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(verificationService.start(
                userDetails.getUsername(),
                request,
                ClientIpResolver.resolve(httpRequest)
        ));
    }

    @Operation(summary = "Завершить проверку ID по auth_code MyID", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Профиль подтверждён"),
            @ApiResponse(responseCode = "400", description = "Ошибка MyID или сессии"),
            @ApiResponse(responseCode = "401", description = "Не авторизован")
    })
    @PostMapping("/complete")
    public ResponseEntity<CompleteVerificationResponse> complete(
            @Valid @RequestBody CompleteVerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(verificationService.complete(
                userDetails.getUsername(),
                request.getAuthCode(),
                request.getSessionId()
        ));
    }
}

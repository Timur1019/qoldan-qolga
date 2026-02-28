package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.auth.AuthResponse;
import com.test.qoldanqolga.dto.auth.LoginRequest;
import com.test.qoldanqolga.dto.auth.RegisterRequest;
import com.test.qoldanqolga.dto.auth.StartVerificationRequest;
import com.test.qoldanqolga.dto.auth.StartVerificationResponse;
import com.test.qoldanqolga.dto.auth.UpdateProfileRequest;
import com.test.qoldanqolga.dto.auth.UserInfo;
import com.test.qoldanqolga.dto.user.ReviewDto;
import com.test.qoldanqolga.service.AuthService;
import com.test.qoldanqolga.service.ReviewService;
import com.test.qoldanqolga.dto.auth.VerificationStartResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Регистрация, вход, профиль")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final ReviewService reviewService;

    @Operation(summary = "Регистрация", description = "Создание нового аккаунта")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Успешно"), @ApiResponse(responseCode = "400", description = "Ошибка валидации")})
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Вход", description = "Получение JWT токена")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Успешно"), @ApiResponse(responseCode = "401", description = "Неверные данные")})
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Текущий пользователь", description = "Профиль авторизованного пользователя", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @GetMapping("/me")
    public ResponseEntity<UserInfo> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        String userId = userDetails.getUsername();
        UserInfo info = authService.getCurrentUser(userId);
        if (info == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(info);
    }

    @Operation(summary = "Обновить профиль", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PatchMapping("/me")
    public ResponseEntity<UserInfo> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserInfo updated = authService.updateProfile(userDetails.getUsername(), request);
        if (updated == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Мои отзывы", description = "Отзывы, которые текущий пользователь оставил другим", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @GetMapping("/me/reviews")
    public ResponseEntity<Page<ReviewDto>> getMyReviews(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(reviewService.getReviewsByAuthor(userDetails.getUsername(), pageable));
    }

    @Operation(summary = "Заявка на верификацию ID", description = "При настроенном MyID и переданном фото — вызов MyID и при успехе отметка профиля проверенным. Иначе — заявка модератору.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "400", description = "Ошибка MyID или валидации"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PostMapping("/verification/start")
    public ResponseEntity<StartVerificationResponse> startVerification(
            @Valid @RequestBody StartVerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        VerificationStartResult result = authService.startVerification(userDetails.getUsername(), request);
        return ResponseEntity.status(result.getStatusCode()).body(result.getResponse());
    }
}

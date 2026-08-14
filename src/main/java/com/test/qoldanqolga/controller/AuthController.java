package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.auth.AuthResponse;
import com.test.qoldanqolga.dto.auth.LoginRequest;
import com.test.qoldanqolga.dto.auth.PhoneSendCodeRequest;
import com.test.qoldanqolga.dto.auth.PhoneSendCodeResponse;
import com.test.qoldanqolga.dto.auth.PhoneVerifyRequest;
import com.test.qoldanqolga.dto.auth.RegisterRequest;
import com.test.qoldanqolga.dto.auth.SmsCallbackRequest;
import com.test.qoldanqolga.dto.auth.UpdateProfileRequest;
import com.test.qoldanqolga.dto.auth.UserInfo;
import com.test.qoldanqolga.dto.user.ReviewDto;
import com.test.qoldanqolga.service.AuthService;
import com.test.qoldanqolga.service.PhoneAuthService;
import com.test.qoldanqolga.service.ReviewService;
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
    private final PhoneAuthService phoneAuthService;
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

    @Operation(summary = "Отправить SMS-код на телефон")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Код отправлен"),
            @ApiResponse(responseCode = "400", description = "Ошибка"),
            @ApiResponse(responseCode = "429", description = "Лимит запросов")
    })
    @PostMapping("/phone/send-code")
    public ResponseEntity<PhoneSendCodeResponse> sendPhoneCode(@Valid @RequestBody PhoneSendCodeRequest request) {
        return ResponseEntity.ok(phoneAuthService.sendCode(request));
    }

    @Operation(summary = "Подтвердить SMS-код и войти / зарегистрироваться")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешно"),
            @ApiResponse(responseCode = "401", description = "Неверный код")
    })
    @PostMapping("/phone/verify")
    public ResponseEntity<AuthResponse> verifyPhone(@Valid @RequestBody PhoneVerifyRequest request) {
        return ResponseEntity.ok(phoneAuthService.verify(request));
    }

    @Operation(summary = "Callback статусов DevSMS (sent / delivered / failed)")
    @PostMapping("/phone/sms-callback")
    public ResponseEntity<Void> smsCallback(@RequestBody SmsCallbackRequest request) {
        phoneAuthService.handleSmsCallback(request);
        return ResponseEntity.ok().build();
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
}

package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.admin.AdminReportListItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserListItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserUpdateRequest;
import com.test.qoldanqolga.dto.business.BusinessApplicationDto;
import com.test.qoldanqolga.dto.homepromo.CreateHomePromoBannerRequest;
import com.test.qoldanqolga.dto.homepromo.HomePromoBannerDto;
import com.test.qoldanqolga.dto.homepromo.UpdateHomePromoBannerRequest;
import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.dto.reference.CreateCategoryRequest;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.AdminReportService;
import com.test.qoldanqolga.service.AdminUserService;
import com.test.qoldanqolga.service.AdminBusinessApplicationService;
import com.test.qoldanqolga.service.HomePromoBannerService;
import com.test.qoldanqolga.service.ReferenceDataService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Админ", description = "Панель администратора, категории, пользователи, жалобы")
@RequiredArgsConstructor
public class AdminController {

    private final ReferenceDataService referenceDataService;
    private final AdminUserService adminUserService;
    private final AdminReportService adminReportService;
    private final AdminBusinessApplicationService adminBusinessApplicationService;
    private final UserRepository userRepository;
    private final HomePromoBannerService homePromoBannerService;

    @Operation(summary = "Дашборд", description = "Только для роли ADMIN", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "403", description = "Доступ запрещён")})
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(@AuthenticationPrincipal UserDetails user) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Панель администратора");
        body.put("userId", user != null ? user.getUsername() : "");
        body.put("totalUsers", userRepository.count());
        body.put("verifiedUsers", userRepository.countByProfileVerifiedTrue());
        body.put("pendingVerification", userRepository.countByVerificationRequestedAtNotNullAndProfileVerifiedFalse());
        return ResponseEntity.ok(body);
    }

    @Operation(summary = "Все категории (админ)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(referenceDataService.getAllCategories());
    }

    @Operation(summary = "Создать категорию", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.ok(referenceDataService.createCategory(request));
    }

    @Operation(summary = "Список пользователей (админ)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserListItemDto>> getUsers(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(adminUserService.getUsers(pageable));
    }

    @Operation(summary = "Обновить пользователя (подтверждение, роль, бан)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Пользователь не найден")
    })
    @PatchMapping("/users/{userId}")
    public ResponseEntity<Void> updateUser(
            @PathVariable String userId,
            @RequestBody AdminUserUpdateRequest request) {
        adminUserService.updateUser(userId, request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Список жалоб на объявления", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/reports")
    public ResponseEntity<Page<AdminReportListItemDto>> getReports(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(adminReportService.getReports(pageable));
    }

    @Operation(summary = "Уведомить продавца о жалобе", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Жалоба не найдена")
    })
    @PostMapping("/reports/{reportId}/notify-seller")
    public ResponseEntity<Void> notifySeller(@PathVariable String reportId) {
        adminReportService.notifySeller(reportId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Список баннеров главной (админ)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/home-promo-banners")
    public ResponseEntity<List<HomePromoBannerDto>> getHomePromoBanners() {
        return ResponseEntity.ok(homePromoBannerService.listForAdmin());
    }

    @Operation(summary = "Создать баннер главной", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @PostMapping("/home-promo-banners")
    public ResponseEntity<HomePromoBannerDto> createHomePromoBanner(@Valid @RequestBody CreateHomePromoBannerRequest request) {
        return ResponseEntity.ok(homePromoBannerService.create(request));
    }

    @Operation(summary = "Обновить баннер главной", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Баннер не найден")
    })
    @PutMapping("/home-promo-banners/{id}")
    public ResponseEntity<HomePromoBannerDto> updateHomePromoBanner(
            @PathVariable String id,
            @Valid @RequestBody UpdateHomePromoBannerRequest request) {
        return ResponseEntity.ok(homePromoBannerService.update(id, request));
    }

    @Operation(summary = "Удалить баннер главной", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Баннер не найден")
    })
    @DeleteMapping("/home-promo-banners/{id}")
    public ResponseEntity<Void> deleteHomePromoBanner(@PathVariable String id) {
        homePromoBannerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Список заявок на статус «Магазин»", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/business-applications")
    public ResponseEntity<Page<BusinessApplicationDto>> getBusinessApplications(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(adminBusinessApplicationService.list(pageable, status));
    }

    @Operation(summary = "Заявка по ID (с ссылками на документы)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Заявка не найдена")
    })
    @GetMapping("/business-applications/{id}")
    public ResponseEntity<BusinessApplicationDto> getBusinessApplication(@PathVariable String id) {
        return ResponseEntity.ok(adminBusinessApplicationService.getById(id));
    }

    @Operation(summary = "Одобрить заявку (статус «Магазин» + сообщение в чат)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Заявка не найдена")
    })
    @PostMapping("/business-applications/{id}/approve")
    public ResponseEntity<Void> approveBusinessApplication(@PathVariable String id) {
        adminBusinessApplicationService.approve(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Отклонить заявку", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Заявка не найдена")
    })
    @PostMapping("/business-applications/{id}/reject")
    public ResponseEntity<Void> rejectBusinessApplication(@PathVariable String id) {
        adminBusinessApplicationService.reject(id);
        return ResponseEntity.noContent().build();
    }
}

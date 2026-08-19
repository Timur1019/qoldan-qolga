package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.admin.AdminAdStatItemDto;
import com.test.qoldanqolga.dto.admin.AdminCreateUserRequest;
import com.test.qoldanqolga.dto.admin.AdminDashboardDto;
import com.test.qoldanqolga.dto.admin.AdminReportListItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserListItemDto;
import com.test.qoldanqolga.dto.admin.AdminUserUpdateRequest;
import com.test.qoldanqolga.dto.business.BusinessApplicationDto;
import com.test.qoldanqolga.dto.homepromo.CreateHomePromoBannerRequest;
import com.test.qoldanqolga.dto.homepromo.HomePromoBannerDto;
import com.test.qoldanqolga.dto.homepromo.UpdateHomePromoBannerRequest;
import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.dto.reference.CreateCategoryRequest;
import com.test.qoldanqolga.dto.homesell.CreateHomeSellBannerRequest;
import com.test.qoldanqolga.dto.homesell.HomeSellBannerDto;
import com.test.qoldanqolga.dto.homesell.UpdateHomeSellBannerRequest;
import com.test.qoldanqolga.dto.sitetop.CreateSiteTopBannerRequest;
import com.test.qoldanqolga.dto.sitetop.SiteTopBannerDto;
import com.test.qoldanqolga.dto.sitetop.UpdateSiteTopBannerRequest;
import com.test.qoldanqolga.service.AdminDashboardService;
import com.test.qoldanqolga.service.AdminStatsService;
import com.test.qoldanqolga.service.AdminReportService;
import com.test.qoldanqolga.service.AdminUserService;
import com.test.qoldanqolga.service.AdminBusinessApplicationService;
import com.test.qoldanqolga.service.HomePromoBannerService;
import com.test.qoldanqolga.service.ReferenceDataService;
import com.test.qoldanqolga.service.HomeSellBannerService;
import com.test.qoldanqolga.service.SiteTopBannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
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

import java.util.List;
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
    private final AdminDashboardService adminDashboardService;
    private final AdminStatsService adminStatsService;
    private final HomePromoBannerService homePromoBannerService;
    private final SiteTopBannerService siteTopBannerService;
    private final HomeSellBannerService homeSellBannerService;

    @Operation(summary = "Дашборд", description = "Только для роли ADMIN", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "403", description = "Доступ запрещён")})
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> dashboard() {
        return ResponseEntity.ok(adminDashboardService.getDashboard());
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

    @Operation(summary = "Создать пользователя (админ)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "409", description = "Email уже занят")
    })
    @PostMapping("/users")
    public ResponseEntity<AdminUserListItemDto> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.ok(adminUserService.createUser(request));
    }

    @Operation(summary = "Детализация пользователей по отчёту", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/stats/users")
    public ResponseEntity<Page<AdminUserListItemDto>> getStatsUsers(
            @RequestParam(defaultValue = "totalUsers") String filter,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(adminStatsService.getUsers(filter, pageable));
    }

    @Operation(summary = "Детализация объявлений по отчёту", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/stats/ads")
    public ResponseEntity<Page<AdminAdStatItemDto>> getStatsAds(
            @RequestParam(defaultValue = "adsTotal") String filter,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(adminStatsService.getAds(filter, pageable));
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

    @Operation(summary = "Список рекламы в шапке (админ)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/site-top-banners")
    public ResponseEntity<List<SiteTopBannerDto>> getSiteTopBanners() {
        return ResponseEntity.ok(siteTopBannerService.listForAdmin());
    }

    @Operation(summary = "Создать рекламу в шапке", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @PostMapping("/site-top-banners")
    public ResponseEntity<SiteTopBannerDto> createSiteTopBanner(@Valid @RequestBody CreateSiteTopBannerRequest request) {
        return ResponseEntity.ok(siteTopBannerService.create(request));
    }

    @Operation(summary = "Обновить рекламу в шапке", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Баннер не найден")
    })
    @PutMapping("/site-top-banners/{id}")
    public ResponseEntity<SiteTopBannerDto> updateSiteTopBanner(
            @PathVariable String id,
            @Valid @RequestBody UpdateSiteTopBannerRequest request) {
        return ResponseEntity.ok(siteTopBannerService.update(id, request));
    }

    @Operation(summary = "Удалить рекламу в шапке", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Баннер не найден")
    })
    @DeleteMapping("/site-top-banners/{id}")
    public ResponseEntity<Void> deleteSiteTopBanner(@PathVariable String id) {
        siteTopBannerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Список баннеров «продавайте» (админ)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/home-sell-banners")
    public ResponseEntity<List<HomeSellBannerDto>> getHomeSellBanners() {
        return ResponseEntity.ok(homeSellBannerService.listForAdmin());
    }

    @Operation(summary = "Создать баннер «продавайте»", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @PostMapping("/home-sell-banners")
    public ResponseEntity<HomeSellBannerDto> createHomeSellBanner(@Valid @RequestBody CreateHomeSellBannerRequest request) {
        return ResponseEntity.ok(homeSellBannerService.create(request));
    }

    @Operation(summary = "Обновить баннер «продавайте»", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Баннер не найден")
    })
    @PutMapping("/home-sell-banners/{id}")
    public ResponseEntity<HomeSellBannerDto> updateHomeSellBanner(
            @PathVariable String id,
            @Valid @RequestBody UpdateHomeSellBannerRequest request) {
        return ResponseEntity.ok(homeSellBannerService.update(id, request));
    }

    @Operation(summary = "Удалить баннер «продавайте»", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Баннер не найден")
    })
    @DeleteMapping("/home-sell-banners/{id}")
    public ResponseEntity<Void> deleteHomeSellBanner(@PathVariable String id) {
        homeSellBannerService.delete(id);
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

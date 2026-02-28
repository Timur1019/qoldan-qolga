package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.ad.AdListParams;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.pagination.CursorPageRequest;
import com.test.qoldanqolga.pagination.CursorPageResponse;
import com.test.qoldanqolga.dto.ad.ReportAdRequest;
import com.test.qoldanqolga.dto.promo.PromoServiceDto;
import com.test.qoldanqolga.dto.promo.CreatePromoOrderRequest;
import com.test.qoldanqolga.service.AdReportService;
import com.test.qoldanqolga.service.AdvertisementService;
import com.test.qoldanqolga.service.FavoriteService;
import com.test.qoldanqolga.service.PromoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/ads")
@Tag(name = "Объявления", description = "CRUD объявлений, избранное, промо")
@RequiredArgsConstructor
public class AdvertisementController {

    private final AdvertisementService advertisementService;
    private final FavoriteService favoriteService;
    private final AdReportService adReportService;
    private final PromoService promoService;

    @Operation(summary = "Список (cursor)", description = "Курсорная пагинация")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/cursor")
    public ResponseEntity<CursorPageResponse<AdListItemDto>> listByCursor(
            @RequestParam(required = false) String cursor,
            @RequestParam(required = false, defaultValue = "20") int limit,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserDetails user
    ) {
        CursorPageRequest request = CursorPageRequest.of(cursor, limit);
        String userId = user != null ? user.getUsername() : null;
        return ResponseEntity.ok(advertisementService.listByCursor(request, status, userId));
    }

    @Operation(summary = "Список объявлений", description = "С фильтрами и страничной пагинацией")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping
    public ResponseEntity<Page<AdListItemDto>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String sellerType,
            @RequestParam(required = false) Boolean hasLicense,
            @RequestParam(required = false) Boolean worksByContract,
            @RequestParam(required = false) BigDecimal priceFrom,
            @RequestParam(required = false) BigDecimal priceTo,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) Boolean urgentBargain,
            @RequestParam(required = false) Boolean canDeliver,
            @RequestParam(required = false) Boolean giveAway,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable,
            @AuthenticationPrincipal UserDetails user
    ) {
        AdListParams params = AdListParams.builder()
                .status(status)
                .category(category)
                .region(region)
                .query(q)
                .sellerType(sellerType)
                .hasLicense(hasLicense)
                .worksByContract(worksByContract)
                .priceFrom(priceFrom)
                .priceTo(priceTo)
                .currency(currency)
                .urgentBargain(urgentBargain)
                .canDeliver(canDeliver)
                .giveAway(giveAway)
                .build();
        String userId = user != null ? user.getUsername() : null;
        return ResponseEntity.ok(advertisementService.list(params, userId, pageable));
    }

    @Operation(summary = "Мои объявления", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @GetMapping("/my")
    public ResponseEntity<Page<AdListItemDto>> myAds(
            @AuthenticationPrincipal UserDetails user,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(advertisementService.listByUser(user.getUsername(), pageable));
    }

    @Operation(summary = "Детали объявления", description = "По ID")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/{id}")
    public ResponseEntity<AdDetailDto> getById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        String userId = user != null ? user.getUsername() : null;
        return ResponseEntity.ok(advertisementService.getById(id, userId));
    }

    @Operation(summary = "Учесть просмотр")
    @ApiResponses(@ApiResponse(responseCode = "204", description = "OK"))
    @PostMapping("/{id}/view")
    public ResponseEntity<Void> recordView(@PathVariable String id) {
        advertisementService.recordView(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Пожаловаться", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PostMapping("/{id}/report")
    public ResponseEntity<Void> report(
            @PathVariable String id,
            @Valid @RequestBody ReportAdRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        adReportService.report(id, request, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Создать объявление", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PostMapping
    public ResponseEntity<AdDetailDto> create(
            @Valid @RequestBody CreateAdRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(advertisementService.create(request, user.getUsername()));
    }

    @Operation(summary = "Обновить объявление", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PutMapping("/{id}")
    public ResponseEntity<AdDetailDto> update(
            @PathVariable String id,
            @Valid @RequestBody CreateAdRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(advertisementService.update(id, request, user.getUsername()));
    }

    @Operation(summary = "Удалить объявление", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        advertisementService.delete(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Архивировать объявление", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PostMapping("/archive/{id}")
    public ResponseEntity<Void> archive(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        advertisementService.archive(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Восстановить из архива", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PostMapping("/restore/{id}")
    public ResponseEntity<Void> restore(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        advertisementService.restore(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Добавить в избранное", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> addFavorite(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        favoriteService.add(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Убрать из избранного", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        favoriteService.remove(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Переключить избранное", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PostMapping("/{id}/favorite/toggle")
    public ResponseEntity<Boolean> toggleFavorite(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        boolean nowFavorite = favoriteService.toggle(user.getUsername(), id);
        return ResponseEntity.ok(nowFavorite);
    }

    @Operation(summary = "Список промо-услуг")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/promo-services")
    public ResponseEntity<List<PromoServiceDto>> getPromoServices() {
        return ResponseEntity.ok(promoService.getServices());
    }

    @Operation(summary = "Заказать промо", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({@ApiResponse(responseCode = "204", description = "OK"), @ApiResponse(responseCode = "401", description = "Не авторизован")})
    @PostMapping("/{adId}/promo/order")
    public ResponseEntity<Void> createPromoOrder(
            @PathVariable String adId,
            @Valid @RequestBody CreatePromoOrderRequest request,
            @AuthenticationPrincipal UserDetails user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        promoService.createOrder(adId, request, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}

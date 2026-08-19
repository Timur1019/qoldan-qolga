package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.adsidebar.AdSidebarBannerDto;
import com.test.qoldanqolga.dto.adsidebar.CreateAdSidebarBannerRequest;
import com.test.qoldanqolga.dto.adsidebar.UpdateAdSidebarBannerRequest;
import com.test.qoldanqolga.service.AdSidebarBannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ad-sidebar-banners")
@RequiredArgsConstructor
@Tag(name = "Админ — реклама в карточке")
public class AdminAdSidebarBannerController {

    private final AdSidebarBannerService adSidebarBannerService;

    @Operation(summary = "Список", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping
    public ResponseEntity<List<AdSidebarBannerDto>> list() {
        return ResponseEntity.ok(adSidebarBannerService.listForAdmin());
    }

    @Operation(summary = "Создать", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @PostMapping
    public ResponseEntity<AdSidebarBannerDto> create(@Valid @RequestBody CreateAdSidebarBannerRequest request) {
        return ResponseEntity.ok(adSidebarBannerService.create(request));
    }

    @Operation(summary = "Обновить", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Не найден")
    })
    @PutMapping("/{id}")
    public ResponseEntity<AdSidebarBannerDto> update(
            @PathVariable String id,
            @Valid @RequestBody UpdateAdSidebarBannerRequest request) {
        return ResponseEntity.ok(adSidebarBannerService.update(id, request));
    }

    @Operation(summary = "Удалить", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "OK"),
            @ApiResponse(responseCode = "404", description = "Не найден")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        adSidebarBannerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

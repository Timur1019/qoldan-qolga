package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.adsidebar.AdSidebarBannerDto;
import com.test.qoldanqolga.service.AdSidebarBannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ad-sidebar-banners")
@RequiredArgsConstructor
@Tag(name = "Реклама в карточке", description = "Боковые баннеры на странице объявления")
public class AdSidebarBannerController {

    private final AdSidebarBannerService adSidebarBannerService;

    @Operation(summary = "Активные баннеры (до 2)")
    @ApiResponse(responseCode = "200", description = "OK")
    @GetMapping
    public ResponseEntity<List<AdSidebarBannerDto>> list() {
        return ResponseEntity.ok(adSidebarBannerService.listPublic());
    }
}

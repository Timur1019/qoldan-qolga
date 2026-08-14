package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.sitetop.SiteTopBannerDto;
import com.test.qoldanqolga.service.SiteTopBannerService;
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
@RequestMapping("/api/site-top-banners")
@RequiredArgsConstructor
@Tag(name = "Реклама в шапке", description = "Публичная полоса над шапкой")
public class SiteTopBannerController {

    private final SiteTopBannerService siteTopBannerService;

    @Operation(summary = "Активные баннеры шапки")
    @ApiResponse(responseCode = "200", description = "OK")
    @GetMapping
    public ResponseEntity<List<SiteTopBannerDto>> list() {
        return ResponseEntity.ok(siteTopBannerService.listPublic());
    }
}

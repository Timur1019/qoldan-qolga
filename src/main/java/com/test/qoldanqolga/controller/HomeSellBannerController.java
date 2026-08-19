package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.homesell.HomeSellBannerDto;
import com.test.qoldanqolga.service.HomeSellBannerService;
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
@RequestMapping("/api/home-sell-banners")
@RequiredArgsConstructor
@Tag(name = "Баннер «продавайте»", description = "Публичный CTA на главной")
public class HomeSellBannerController {

    private final HomeSellBannerService homeSellBannerService;

    @Operation(summary = "Активные баннеры «продавайте»")
    @ApiResponse(responseCode = "200", description = "OK")
    @GetMapping
    public ResponseEntity<List<HomeSellBannerDto>> list() {
        return ResponseEntity.ok(homeSellBannerService.listPublic());
    }
}

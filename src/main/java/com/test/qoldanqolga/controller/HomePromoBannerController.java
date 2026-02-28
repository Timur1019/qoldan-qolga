package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.homepromo.HomePromoBannerDto;
import com.test.qoldanqolga.service.HomePromoBannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/home-promo-banners")
@Tag(name = "Главная", description = "Публичные данные для главной страницы")
@RequiredArgsConstructor
public class HomePromoBannerController {

    private final HomePromoBannerService homePromoBannerService;

    @Operation(summary = "Список баннеров «Выгодно и полезно»")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping
    public ResponseEntity<List<HomePromoBannerDto>> list() {
        return ResponseEntity.ok(homePromoBannerService.listForHome());
    }
}

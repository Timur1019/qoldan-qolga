package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.business.BusinessApplicationDto;
import com.test.qoldanqolga.service.BusinessApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/business-applications")
@Tag(name = "Заявки для бизнеса", description = "Qoldan Qolga для бизнеса — заявка на статус «Магазин»")
@RequiredArgsConstructor
public class BusinessApplicationController {

    private final BusinessApplicationService businessApplicationService;

    @Operation(summary = "Подать заявку", description = "Мультипарт: поля формы + файлы passport и registration")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Заявка создана"),
            @ApiResponse(responseCode = "400", description = "Неверные данные или отсутствуют файлы")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BusinessApplicationDto> create(
            @RequestParam("fullName") String fullName,
            @RequestParam("shopName") String shopName,
            @RequestParam("businessType") String businessType,
            @RequestParam(value = "passport", required = false) MultipartFile passport,
            @RequestParam(value = "registration", required = false) MultipartFile registration,
            @RequestParam("city") String city,
            @RequestParam("productCategory") String productCategory,
            @RequestParam(value = "shopUrl", required = false) String shopUrl,
            @RequestParam("phone") String phone,
            @RequestParam(value = "agreement", defaultValue = "false") String agreement,
            @AuthenticationPrincipal UserDetails user
    ) {
        String userId = user != null ? user.getUsername() : null;
        boolean agreementAccepted = "true".equalsIgnoreCase(agreement) || "on".equalsIgnoreCase(agreement);
        BusinessApplicationDto dto = businessApplicationService.create(
                fullName, shopName, businessType,
                passport, registration,
                city, productCategory, shopUrl, phone,
                agreementAccepted, userId
        );
        return ResponseEntity.ok(dto);
    }
}

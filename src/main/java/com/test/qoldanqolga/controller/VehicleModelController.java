package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.reference.VehicleModelDto;
import com.test.qoldanqolga.service.VehicleModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@Tag(name = "Справочники", description = "Модели транспорта")
@RequiredArgsConstructor
public class VehicleModelController {

    private final VehicleModelService vehicleModelService;

    @Operation(summary = "Модели по марке")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/{brandId}/models")
    public ResponseEntity<List<VehicleModelDto>> getModels(@PathVariable String brandId) {
        return ResponseEntity.ok(vehicleModelService.getByBrandId(brandId));
    }
}

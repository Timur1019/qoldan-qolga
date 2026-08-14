package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.reference.BrandDto;
import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.dto.reference.RegionDto;
import com.test.qoldanqolga.dto.reference.VehicleSpecOptionsDto;
import com.test.qoldanqolga.service.ReferenceDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "Справочники", description = "Регионы, категории (публичные)")
@RequiredArgsConstructor
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    @Operation(summary = "Список регионов")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/regions")
    public ResponseEntity<List<RegionDto>> getRegions() {
        return ResponseEntity.ok(referenceDataService.getAllRegions());
    }

    @Operation(summary = "Корневые категории")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(referenceDataService.getRootCategories());
    }

    @Operation(summary = "Категория по коду")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "OK"), @ApiResponse(responseCode = "404", description = "Не найдена")})
    @GetMapping("/categories/{code}")
    public ResponseEntity<CategoryDto> getCategoryByCode(@PathVariable String code) {
        return referenceDataService.getCategoryByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Путь категории (хлебные крошки: от корня до категории)")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/categories/{code}/breadcrumb")
    public ResponseEntity<List<CategoryDto>> getCategoryBreadcrumb(@PathVariable String code) {
        return ResponseEntity.ok(referenceDataService.getCategoryBreadcrumb(code));
    }

    @Operation(summary = "Дочерние категории")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/categories/{code}/children")
    public ResponseEntity<List<CategoryDto>> getCategoryChildren(@PathVariable String code) {
        return ResponseEntity.ok(referenceDataService.getChildCategories(code));
    }

    @Operation(summary = "Категории для главной")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/categories/home")
    public ResponseEntity<List<CategoryDto>> getCategoriesForHome() {
        return ResponseEntity.ok(referenceDataService.getCategoriesForHome());
    }

    @Operation(summary = "Список брендов (активные, по sort_order)")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/brands")
    public ResponseEntity<List<BrandDto>> getBrands() {
        return ResponseEntity.ok(referenceDataService.getAllBrands());
    }

    @Operation(summary = "Бренды по коду категории (например, Elektronika)")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/categories/{code}/brands")
    public ResponseEntity<List<BrandDto>> getBrandsByCategory(@PathVariable String code) {
        return ResponseEntity.ok(referenceDataService.getBrandsByCategoryCode(code));
    }

    @Operation(summary = "Справочник характеристик авто (кузов, КПП, цвет и т.д.)")
    @ApiResponses(@ApiResponse(responseCode = "200", description = "OK"))
    @GetMapping("/vehicle-spec-options")
    public ResponseEntity<VehicleSpecOptionsDto> getVehicleSpecOptions() {
        return ResponseEntity.ok(referenceDataService.getVehicleSpecOptions());
    }
}

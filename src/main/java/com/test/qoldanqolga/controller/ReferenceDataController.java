package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.dto.reference.RegionDto;
import com.test.qoldanqolga.service.ReferenceDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    @GetMapping("/regions")
    public ResponseEntity<List<RegionDto>> getRegions() {
        return ResponseEntity.ok(referenceDataService.getAllRegions());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(referenceDataService.getRootCategories());
    }

    @GetMapping("/categories/{code}")
    public ResponseEntity<CategoryDto> getCategoryByCode(@PathVariable String code) {
        return referenceDataService.getCategoryByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categories/{code}/children")
    public ResponseEntity<List<CategoryDto>> getCategoryChildren(@PathVariable String code) {
        return ResponseEntity.ok(referenceDataService.getChildCategories(code));
    }

    @GetMapping("/categories/home")
    public ResponseEntity<List<CategoryDto>> getCategoriesForHome() {
        return ResponseEntity.ok(referenceDataService.getCategoriesForHome());
    }
}

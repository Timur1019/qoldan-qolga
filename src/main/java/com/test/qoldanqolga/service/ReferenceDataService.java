package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.reference.BrandDto;
import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.dto.reference.CreateCategoryRequest;
import com.test.qoldanqolga.dto.reference.RegionDto;
import com.test.qoldanqolga.model.District;
import com.test.qoldanqolga.model.Region;

import java.util.List;
import java.util.Optional;

public interface ReferenceDataService {

    List<RegionDto> getAllRegions();

    List<CategoryDto> getAllCategories();

    CategoryDto createCategory(CreateCategoryRequest request);

    List<CategoryDto> getRootCategories();

    Optional<CategoryDto> getCategoryByCode(String code);

    /** Путь от корневой категории до указанной (включительно). Пустой список, если категория не найдена. */
    List<CategoryDto> getCategoryBreadcrumb(String code);

    List<CategoryDto> getChildCategories(String parentCode);

    List<CategoryDto> getCategoriesForHome();

    List<BrandDto> getAllBrands();

    List<BrandDto> getBrandsByCategoryCode(String categoryCode);
}

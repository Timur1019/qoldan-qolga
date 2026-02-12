package com.test.qoldanqolga.service;

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

    List<CategoryDto> getChildCategories(String parentCode);

    List<CategoryDto> getCategoriesForHome();
}

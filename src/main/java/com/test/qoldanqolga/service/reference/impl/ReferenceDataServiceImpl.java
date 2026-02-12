package com.test.qoldanqolga.service.reference.impl;

import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.dto.reference.CreateCategoryRequest;
import com.test.qoldanqolga.dto.reference.RegionDto;
import com.test.qoldanqolga.model.Category;
import com.test.qoldanqolga.repository.CategoryRepository;
import com.test.qoldanqolga.repository.RegionRepository;
import com.test.qoldanqolga.service.ReferenceDataService;
import com.test.qoldanqolga.service.reference.cache.CategoryParentCache;
import com.test.qoldanqolga.service.reference.command.CategoryCommandService;
import com.test.qoldanqolga.mapper.CategoryMapper;
import com.test.qoldanqolga.mapper.RegionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Справочные данные: регионы, категории.
 * Делегирует маппинг в MapStruct, кэш parentIds — в CategoryParentCache.
 */
@Service
@RequiredArgsConstructor
public class ReferenceDataServiceImpl implements ReferenceDataService {

    private final RegionRepository regionRepository;
    private final CategoryRepository categoryRepository;
    private final RegionMapper regionMapper;
    private final CategoryMapper categoryMapper;
    private final CategoryParentCache categoryParentCache;
    private final CategoryCommandService categoryCommandService;

    @Override
    public List<RegionDto> getAllRegions() {
        return regionMapper.toDtoList(regionRepository.findAllWithDistrictsByOrderBySortOrderAscNameUzAsc());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        return categoryMapper.toDtoList(categoryRepository.findAllByOrderBySortOrderAscNameUzAsc(), parentIds);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getRootCategories() {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        return categoryMapper.toDtoList(categoryRepository.findByParentIdIsNullOrderBySortOrderAscNameUzAsc(), parentIds);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoryDto> getCategoryByCode(String code) {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        return categoryRepository.findByCode(code)
                .map(c -> categoryMapper.toDto(c, parentIds));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getChildCategories(String parentCode) {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        return categoryRepository.findByCode(parentCode)
                .map(parent -> categoryMapper.toDtoList(
                        categoryRepository.findByParentIdOrderBySortOrderAscNameUzAsc(parent.getId()), parentIds))
                .orElse(List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesForHome() {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        return categoryMapper.toDtoList(categoryRepository.findByShowOnHomeTrueOrderBySortOrderAscNameUzAsc(), parentIds);
    }

    @Override
    public CategoryDto createCategory(CreateCategoryRequest request) {
        Category category = categoryCommandService.createCategory(request);
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        return categoryMapper.toDto(category, false);
    }
}

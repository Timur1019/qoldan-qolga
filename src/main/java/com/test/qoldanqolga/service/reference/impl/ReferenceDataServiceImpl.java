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
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
    @Cacheable("regions")
    public List<RegionDto> getAllRegions() {
        List<RegionDto> regions = regionMapper.toDtoList(regionRepository.findAllWithDistrictsByOrderBySortOrderAscNameUzAsc());
        LogUtil.debug(ReferenceDataServiceImpl.class, "Regions loaded: count={}", regions.size());
        return regions;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("categories")
    public List<CategoryDto> getAllCategories() {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        List<CategoryDto> list = categoryMapper.toDtoList(categoryRepository.findAllByOrderBySortOrderAscNameUzAsc(), parentIds);
        LogUtil.debug(ReferenceDataServiceImpl.class, "All categories loaded: count={}", list.size());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getRootCategories() {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        List<CategoryDto> list = categoryMapper.toDtoList(categoryRepository.findByParentIdIsNullOrderBySortOrderAscNameUzAsc(), parentIds);
        LogUtil.debug(ReferenceDataServiceImpl.class, "Root categories loaded: count={}", list.size());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoryDto> getCategoryByCode(String code) {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        Optional<CategoryDto> result = categoryRepository.findByCode(code)
                .map(c -> categoryMapper.toDto(c, parentIds));
        LogUtil.debug(ReferenceDataServiceImpl.class, "Category by code: code={} found={}", code, result.isPresent());
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getChildCategories(String parentCode) {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        List<CategoryDto> list = categoryRepository.findByCode(parentCode)
                .map(parent -> categoryMapper.toDtoList(
                        categoryRepository.findByParentIdOrderBySortOrderAscNameUzAsc(parent.getId()), parentIds))
                .orElse(List.of());
        LogUtil.debug(ReferenceDataServiceImpl.class, "Child categories: parentCode={} count={}", parentCode, list.size());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("categoriesHome")
    public List<CategoryDto> getCategoriesForHome() {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        List<CategoryDto> list = categoryMapper.toDtoList(categoryRepository.findByShowOnHomeTrueOrderBySortOrderAscNameUzAsc(), parentIds);
        LogUtil.debug(ReferenceDataServiceImpl.class, "Categories for home: count={}", list.size());
        return list;
    }

    @Override
    @CacheEvict(value = {"categories", "categoriesHome"}, allEntries = true)
    public CategoryDto createCategory(CreateCategoryRequest request) {
        LogUtil.info(ReferenceDataServiceImpl.class, "Creating category: code={}", request.getCode());
        Category category = categoryCommandService.createCategory(request);
        return categoryMapper.toDto(category, false);
    }
}

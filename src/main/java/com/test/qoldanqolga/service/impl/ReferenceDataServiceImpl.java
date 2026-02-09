package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.dto.reference.DistrictDto;
import com.test.qoldanqolga.dto.reference.RegionDto;
import com.test.qoldanqolga.model.Category;
import com.test.qoldanqolga.model.District;
import com.test.qoldanqolga.model.Region;
import com.test.qoldanqolga.repository.CategoryRepository;
import com.test.qoldanqolga.repository.RegionRepository;
import com.test.qoldanqolga.service.ReferenceDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReferenceDataServiceImpl implements ReferenceDataService {

    private final RegionRepository regionRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RegionDto> getAllRegions() {
        return regionRepository.findAllWithDistrictsByOrderBySortOrderAscNameUzAsc().stream()
                .map(this::toRegionDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        Set<Long> parentIds = getCategoryParentIdsWithChildren();
        return categoryRepository.findAllByOrderBySortOrderAscNameUzAsc().stream()
                .map(c -> toCategoryDto(c, parentIds.contains(c.getId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getRootCategories() {
        Set<Long> parentIds = getCategoryParentIdsWithChildren();
        return categoryRepository.findByParentIdIsNullOrderBySortOrderAscNameUzAsc().stream()
                .map(c -> toCategoryDto(c, parentIds.contains(c.getId())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoryDto> getCategoryByCode(String code) {
        Set<Long> parentIds = getCategoryParentIdsWithChildren();
        return categoryRepository.findByCode(code)
                .map(c -> toCategoryDto(c, parentIds.contains(c.getId())));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getChildCategories(String parentCode) {
        Set<Long> parentIds = getCategoryParentIdsWithChildren();
        return categoryRepository.findByCode(parentCode)
                .map(parent -> categoryRepository.findByParentIdOrderBySortOrderAscNameUzAsc(parent.getId()).stream()
                        .map(c -> toCategoryDto(c, parentIds.contains(c.getId())))
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesForHome() {
        Set<Long> parentIds = getCategoryParentIdsWithChildren();
        return categoryRepository.findByShowOnHomeTrueOrderBySortOrderAscNameUzAsc().stream()
                .map(c -> toCategoryDto(c, parentIds.contains(c.getId())))
                .collect(Collectors.toList());
    }

    /** Один запрос вместо N для определения hasChildren у категорий. */
    private Set<Long> getCategoryParentIdsWithChildren() {
        return categoryRepository.findDistinctParentIds().stream().collect(Collectors.toSet());
    }

    private RegionDto toRegionDto(Region r) {
        List<DistrictDto> districts = r.getDistricts().stream()
                .map(this::toDistrictDto)
                .collect(Collectors.toList());
        return new RegionDto(r.getId(), r.getNameUz(), r.getNameRu(), r.getCode(), districts);
    }

    private DistrictDto toDistrictDto(District d) {
        return new DistrictDto(d.getId(), d.getNameUz(), d.getNameRu());
    }

    private CategoryDto toCategoryDto(Category c, boolean hasChildren) {
        return new CategoryDto(c.getId(), c.getNameUz(), c.getNameRu(), c.getCode(), c.getShowOnHome(),
                c.getParentId(), hasChildren);
    }
}

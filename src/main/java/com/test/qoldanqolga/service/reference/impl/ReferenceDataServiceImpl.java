package com.test.qoldanqolga.service.reference.impl;

import com.test.qoldanqolga.constant.AdConstants;
import com.test.qoldanqolga.constant.VehicleSpecGroupCodes;
import com.test.qoldanqolga.dto.reference.BrandDto;
import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.dto.reference.CreateCategoryRequest;
import com.test.qoldanqolga.dto.reference.RegionDto;
import com.test.qoldanqolga.dto.reference.VehicleSpecOptionDto;
import com.test.qoldanqolga.dto.reference.VehicleSpecOptionsDto;
import com.test.qoldanqolga.model.Category;
import com.test.qoldanqolga.model.VehicleSpecOption;
import com.test.qoldanqolga.repository.AdvertisementRepository;
import com.test.qoldanqolga.repository.BrandRepository;
import com.test.qoldanqolga.repository.CategoryRepository;
import com.test.qoldanqolga.repository.RegionRepository;
import com.test.qoldanqolga.repository.VehicleSpecOptionRepository;
import com.test.qoldanqolga.mapper.BrandMapper;
import com.test.qoldanqolga.service.ReferenceDataService;
import com.test.qoldanqolga.service.component.CategoryResolver;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Справочные данные: регионы, категории.
 * Делегирует маппинг в MapStruct, кэш parentIds — в CategoryParentCache.
 */
@Service
@RequiredArgsConstructor
public class ReferenceDataServiceImpl implements ReferenceDataService {

    private final RegionRepository regionRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final AdvertisementRepository advertisementRepository;
    private final VehicleSpecOptionRepository vehicleSpecOptionRepository;
    private final RegionMapper regionMapper;
    private final CategoryMapper categoryMapper;
    private final BrandMapper brandMapper;
    private final CategoryParentCache categoryParentCache;
    private final CategoryCommandService categoryCommandService;
    private final CategoryResolver categoryResolver;

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
        fillParentCodes(list);
        LogUtil.debug(ReferenceDataServiceImpl.class, "All categories loaded: count={}", list.size());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("categoryRoots")
    public List<CategoryDto> getRootCategories() {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        List<CategoryDto> list = categoryMapper.toDtoList(categoryRepository.findByParentIdIsNullOrderBySortOrderAscNameUzAsc(), parentIds);
        fillParentCodes(list);
        LogUtil.debug(ReferenceDataServiceImpl.class, "Root categories loaded: count={}", list.size());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "categoryByCode", key = "#code")
    public Optional<CategoryDto> getCategoryByCode(String code) {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        Optional<CategoryDto> result = categoryRepository.findByCode(code)
                .map(c -> {
                    CategoryDto dto = categoryMapper.toDto(c, parentIds);
                    if (dto.getParentId() != null && !dto.getParentId().isBlank()) {
                        categoryRepository.findById(dto.getParentId())
                                .ifPresent(parent -> dto.setParentCode(parent.getCode()));
                    }
                    return dto;
                });
        LogUtil.debug(ReferenceDataServiceImpl.class, "Category by code: code={} found={}", code, result.isPresent());
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "categoryBreadcrumb", key = "#code")
    public List<CategoryDto> getCategoryBreadcrumb(String code) {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        List<CategoryDto> path = new ArrayList<>();
        Optional<Category> current = categoryRepository.findByCode(code);
        while (current.isPresent()) {
            Category c = current.get();
            CategoryDto dto = categoryMapper.toDto(c, parentIds);
            path.add(0, dto);
            if (c.getParentId() == null || c.getParentId().isBlank()) {
                break;
            }
            current = categoryRepository.findById(c.getParentId());
        }
        fillParentCodes(path);
        LogUtil.debug(ReferenceDataServiceImpl.class, "Category breadcrumb: code={} pathSize={}", code, path.size());
        return path;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "categoryChildren", key = "#parentCode")
    public List<CategoryDto> getChildCategories(String parentCode) {
        Set<String> parentIds = categoryParentCache.getParentIdsWithChildren();
        List<CategoryDto> list = categoryRepository.findByCode(parentCode)
                .map(parent -> {
                    List<CategoryDto> dtos = categoryMapper.toDtoList(
                            categoryRepository.findByParentIdOrderBySortOrderAscNameUzAsc(parent.getId()), parentIds);
                    dtos.forEach(dto -> dto.setParentCode(parent.getCode()));
                    return dtos;
                })
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
        fillParentCodes(list);
        LogUtil.debug(ReferenceDataServiceImpl.class, "Categories for home: count={}", list.size());
        return list;
    }

    @Override
    @CacheEvict(value = {
            "categories", "categoriesHome", "categoryRoots", "categoryByCode",
            "categoryBreadcrumb", "categoryChildren", "categoryCodes", "brandsByCategory"
    }, allEntries = true)
    public CategoryDto createCategory(CreateCategoryRequest request) {
        LogUtil.info(ReferenceDataServiceImpl.class, "Creating category: code={}", request.getCode());
        Category category = categoryCommandService.createCategory(request);
        CategoryDto dto = categoryMapper.toDto(category, false);
        fillParentCodes(List.of(dto));
        return dto;
    }

    private void fillParentCodes(List<CategoryDto> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            return;
        }
        Set<String> parentIds = dtos.stream()
                .map(CategoryDto::getParentId)
                .filter(id -> id != null && !id.isBlank())
                .collect(Collectors.toSet());
        if (parentIds.isEmpty()) {
            return;
        }
        Map<String, String> idToCode = categoryRepository.findAllById(parentIds).stream()
                .collect(Collectors.toMap(Category::getId, Category::getCode, (a, b) -> a));
        for (CategoryDto dto : dtos) {
            if (dto.getParentCode() != null && !dto.getParentCode().isBlank()) {
                continue;
            }
            if (dto.getParentId() == null || dto.getParentId().isBlank()) {
                continue;
            }
            dto.setParentCode(idToCode.get(dto.getParentId()));
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("brands")
    public List<BrandDto> getAllBrands() {
        List<BrandDto> list = brandMapper.toDtoList(brandRepository.findByIsActiveTrueOrderBySortOrderAscNameUzAsc());
        LogUtil.debug(ReferenceDataServiceImpl.class, "Brands loaded: count={}", list.size());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "brandsByCategory", key = "#categoryCode")
    public List<BrandDto> getBrandsByCategoryCode(String categoryCode) {
        List<String> codes = categoryResolver.resolveCategoryCodes(categoryCode);
        if (codes == null || codes.isEmpty()) {
            codes = List.of(categoryCode);
        }
        List<BrandDto> list = brandMapper.toDtoList(
                brandRepository.findByCategoryCodeInOrderBySortOrderAscNameUzAsc(codes));
        enrichBrandAdCounts(list, codes);
        LogUtil.debug(ReferenceDataServiceImpl.class, "Brands by category: code={} descendants={} count={}",
                categoryCode, codes.size(), list.size());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("vehicleSpecOptions")
    public VehicleSpecOptionsDto getVehicleSpecOptions() {
        List<VehicleSpecOption> rows = vehicleSpecOptionRepository
                .findByIsActiveTrueAndDeletedAtIsNullOrderByGroupCodeAscSortOrderAsc();
        VehicleSpecOptionsDto dto = VehicleSpecOptionsDto.builder().build();
        for (VehicleSpecOption row : rows) {
            VehicleSpecOptionDto item = VehicleSpecOptionDto.builder()
                    .value(row.getValueCode())
                    .nameUz(row.getNameUz())
                    .nameRu(row.getNameRu())
                    .build();
            switch (row.getGroupCode() != null ? row.getGroupCode() : "") {
                case VehicleSpecGroupCodes.BODY_TYPE -> dto.getBodyType().add(item);
                case VehicleSpecGroupCodes.TRANSMISSION -> dto.getTransmission().add(item);
                case VehicleSpecGroupCodes.FUEL_TYPE -> dto.getFuelType().add(item);
                case VehicleSpecGroupCodes.DRIVE_TYPE -> dto.getDriveType().add(item);
                case VehicleSpecGroupCodes.EXTERIOR_COLOR -> dto.getExteriorColor().add(item);
                case VehicleSpecGroupCodes.SEATS -> dto.getSeats().add(item);
                case VehicleSpecGroupCodes.STEERING -> dto.getSteering().add(item);
                case VehicleSpecGroupCodes.OWNERS_COUNT -> dto.getOwnersCount().add(item);
                default -> { }
            }
        }
        LogUtil.debug(ReferenceDataServiceImpl.class, "Vehicle spec options loaded");
        return dto;
    }

    private void enrichBrandAdCounts(List<BrandDto> brands, List<String> categoryCodes) {
        if (brands == null || brands.isEmpty() || categoryCodes == null || categoryCodes.isEmpty()) {
            return;
        }
        List<String> brandIds = brands.stream()
                .map(BrandDto::getId)
                .filter(id -> id != null && !id.isBlank())
                .distinct()
                .collect(Collectors.toList());
        if (brandIds.isEmpty()) {
            brands.forEach(b -> b.setAdCount(0L));
            return;
        }
        Map<String, Long> counts = new HashMap<>();
        for (Object[] row : advertisementRepository.countActiveByBrandIdInAndCategoryIn(
                AdConstants.STATUS_ACTIVE, brandIds, categoryCodes)) {
            if (row == null || row.length < 2 || row[0] == null) continue;
            counts.put(String.valueOf(row[0]), row[1] instanceof Number n ? n.longValue() : 0L);
        }
        for (BrandDto brand : brands) {
            brand.setAdCount(counts.getOrDefault(brand.getId(), 0L));
        }
        brands.sort((a, b) -> {
            long ca = a.getAdCount() != null ? a.getAdCount() : 0L;
            long cb = b.getAdCount() != null ? b.getAdCount() : 0L;
            if (ca != cb) return Long.compare(cb, ca);
            int sa = a.getSortOrder() != null ? a.getSortOrder() : 0;
            int sb = b.getSortOrder() != null ? b.getSortOrder() : 0;
            if (sa != sb) return Integer.compare(sa, sb);
            String na = a.getNameRu() != null ? a.getNameRu() : "";
            String nb = b.getNameRu() != null ? b.getNameRu() : "";
            return na.compareToIgnoreCase(nb);
        });
    }
}

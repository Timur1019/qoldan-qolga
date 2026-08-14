package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.reference.VehicleModelDto;
import com.test.qoldanqolga.mapper.VehicleModelMapper;
import com.test.qoldanqolga.repository.VehicleModelRepository;
import com.test.qoldanqolga.service.VehicleModelService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleModelServiceImpl implements VehicleModelService {

    private final VehicleModelRepository vehicleModelRepository;
    private final VehicleModelMapper vehicleModelMapper;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "vehicleModels", key = "#brandId", condition = "#brandId != null && !#brandId.isBlank()")
    public List<VehicleModelDto> getByBrandId(String brandId) {
        if (brandId == null || brandId.isBlank()) {
            return List.of();
        }
        List<VehicleModelDto> models = vehicleModelMapper.toDtoList(
                vehicleModelRepository.findByBrandIdAndIsActiveTrueOrderBySortOrderAscNameUzAsc(brandId)
        );
        LogUtil.debug(VehicleModelServiceImpl.class, "Models for brand {}: {}", brandId, models.size());
        return models;
    }
}

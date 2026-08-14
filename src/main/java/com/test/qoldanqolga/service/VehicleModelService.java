package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.reference.VehicleModelDto;

import java.util.List;

public interface VehicleModelService {

    List<VehicleModelDto> getByBrandId(String brandId);
}

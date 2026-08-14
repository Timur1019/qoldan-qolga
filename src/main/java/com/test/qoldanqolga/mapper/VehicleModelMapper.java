package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.reference.VehicleModelDto;
import com.test.qoldanqolga.model.VehicleModel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VehicleModelMapper extends BaseMapper<VehicleModel, VehicleModelDto> {
}

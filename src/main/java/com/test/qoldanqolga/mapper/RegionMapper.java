package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.reference.DistrictDto;
import com.test.qoldanqolga.dto.reference.RegionDto;
import com.test.qoldanqolga.model.District;
import com.test.qoldanqolga.model.Region;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RegionMapper extends BaseMapper<Region, RegionDto> {

    DistrictDto toDto(District district);
}

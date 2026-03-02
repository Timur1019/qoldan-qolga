package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.reference.BrandDto;
import com.test.qoldanqolga.model.Brand;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BrandMapper extends BaseMapper<Brand, BrandDto> {
}

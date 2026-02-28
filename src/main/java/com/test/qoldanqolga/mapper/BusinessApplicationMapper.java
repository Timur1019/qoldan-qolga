package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.business.BusinessApplicationDto;
import com.test.qoldanqolga.model.BusinessApplication;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BusinessApplicationMapper extends BaseMapper<BusinessApplication, BusinessApplicationDto> {
}

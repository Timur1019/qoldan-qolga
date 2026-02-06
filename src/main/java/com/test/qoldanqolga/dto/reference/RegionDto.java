package com.test.qoldanqolga.dto.reference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionDto {
    private Long id;
    private String nameUz;
    private String nameRu;
    private String code;
    private List<DistrictDto> districts;
}

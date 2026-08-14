package com.test.qoldanqolga.dto.reference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleSpecOptionDto {
    private String value;
    private String nameUz;
    private String nameRu;
}

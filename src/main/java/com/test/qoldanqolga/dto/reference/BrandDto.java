package com.test.qoldanqolga.dto.reference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandDto {
    private String id;
    private String nameUz;
    private String nameRu;
    private String slug;
    private Integer sortOrder;
    private Boolean isPopular;
}

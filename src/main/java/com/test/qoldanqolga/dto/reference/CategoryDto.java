package com.test.qoldanqolga.dto.reference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Long id;
    private String nameUz;
    private String nameRu;
    private String code;
    private Boolean showOnHome;
    private Long parentId;
    private Boolean hasChildren;
}

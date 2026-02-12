package com.test.qoldanqolga.dto.ad;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdImageDto {
    private String id;
    private String url;
    private Boolean isMain;
    private Integer orderNum;
}

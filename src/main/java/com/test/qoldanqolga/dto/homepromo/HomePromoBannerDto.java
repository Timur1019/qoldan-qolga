package com.test.qoldanqolga.dto.homepromo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomePromoBannerDto {

    private String id;
    private String title;
    private String subtitle;
    private String badge;
    private String link;
    private String imageUrl;
    private Integer sortOrder;
}

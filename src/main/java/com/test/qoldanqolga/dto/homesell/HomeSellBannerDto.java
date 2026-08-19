package com.test.qoldanqolga.dto.homesell;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HomeSellBannerDto {
    private String id;
    private String kicker;
    private String title;
    private String subtitle;
    private String ctaText;
    private String ctaUrl;
    private String imageUrl;
    private Boolean enabled;
    private Integer sortOrder;
}

package com.test.qoldanqolga.dto.adsidebar;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdSidebarBannerDto {
    private String id;
    private String title;
    private String imageUrl;
    private String linkUrl;
    private Boolean enabled;
    private Integer sortOrder;
}

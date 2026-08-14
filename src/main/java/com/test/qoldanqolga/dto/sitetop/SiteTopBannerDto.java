package com.test.qoldanqolga.dto.sitetop;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SiteTopBannerDto {
    private String id;
    private String title;
    private String linkText;
    private String linkUrl;
    private String iconUrl;
    private Boolean enabled;
    private Integer sortOrder;
}

package com.test.qoldanqolga.dto.sitetop;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateSiteTopBannerRequest {

    @NotBlank(message = "Текст обязателен")
    @Size(max = 300)
    private String title;

    @Size(max = 100)
    private String linkText;

    @Size(max = 500)
    private String linkUrl;

    @Size(max = 500)
    private String iconUrl;

    private Boolean enabled;

    private Integer sortOrder;
}

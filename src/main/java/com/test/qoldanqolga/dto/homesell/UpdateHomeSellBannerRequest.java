package com.test.qoldanqolga.dto.homesell;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateHomeSellBannerRequest {

    @Size(max = 120)
    private String kicker;

    @NotBlank(message = "Заголовок обязателен")
    @Size(max = 300)
    private String title;

    @Size(max = 500)
    private String subtitle;

    @Size(max = 120)
    private String ctaText;

    @Size(max = 500)
    private String ctaUrl;

    @Size(max = 500)
    private String imageUrl;

    private Boolean enabled;

    private Integer sortOrder;
}

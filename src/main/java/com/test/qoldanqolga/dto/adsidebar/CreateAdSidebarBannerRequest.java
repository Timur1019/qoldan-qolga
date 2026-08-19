package com.test.qoldanqolga.dto.adsidebar;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateAdSidebarBannerRequest {

    @Size(max = 200)
    private String title;

    @NotBlank(message = "Загрузите картинку")
    @Size(max = 500)
    private String imageUrl;

    @NotBlank(message = "Укажите ссылку")
    @Size(max = 500)
    private String linkUrl;

    private Boolean enabled;

    private Integer sortOrder;
}

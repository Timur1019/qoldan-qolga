package com.test.qoldanqolga.dto.homepromo;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateHomePromoBannerRequest {

    @Size(max = 200)
    private String title;

    @Size(max = 500)
    private String subtitle;

    @Size(max = 100)
    private String badge;

    @Size(max = 500)
    private String link;

    @Size(max = 500)
    private String imageUrl;

    private Integer sortOrder;
}

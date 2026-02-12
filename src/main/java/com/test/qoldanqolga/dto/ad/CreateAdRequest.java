package com.test.qoldanqolga.dto.ad;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAdRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal price;

    @Size(max = 3)
    private String currency = "UZS";

    @NotBlank
    @Size(max = 50)
    private String category = "Xizmatlar";

    @NotBlank
    @Size(max = 20)
    private String phone;

    @Size(max = 100)
    private String email;

    @Size(max = 50)
    private String region;

    @Size(max = 50)
    private String district;

    private Boolean isNegotiable = false;

    private Boolean canDeliver = false;

    /** PRIVATE | BUSINESS */
    @Size(max = 20)
    private String sellerType;

    private Boolean hasLicense = false;

    private Boolean worksByContract = false;

    private Boolean urgentBargain = false;

    private Boolean giveAway = false;

    @NotNull
    private Instant expiresAt;

    private List<String> imageUrls;
}

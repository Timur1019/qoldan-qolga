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

    /** Опционально: бренд (для категорий типа Электроника). */
    @Size(max = 36)
    private String brandId;

    /** USED | USED_LIKE_NEW | USED_GOOD | USED_FAIR | NEW | HANDMADE */
    @Size(max = 25)
    private String itemCondition = "USED";

    /** Возможна аренда (для одежды/обуви) */
    private Boolean canRent = false;

    @Size(max = 36)
    private String modelId;

    @Size(max = 100)
    private String modelCustom;

    private Integer year;

    private Integer mileage;

    @Size(max = 30)
    private String bodyType;

    @Size(max = 20)
    private String transmission;

    @Size(max = 20)
    private String fuelType;

    @Size(max = 10)
    private String driveType;

    private BigDecimal engineVolume;

    @Size(max = 30)
    private String exteriorColor;

    private Integer seats;

    @Size(max = 10)
    private String steering;

    private Integer ownersCount;

    /** SALE | RENT */
    @Size(max = 10)
    private String dealType;

    /** 0 = студия */
    private Integer rooms;

    private BigDecimal areaM2;

    private BigDecimal landAreaM2;

    private Integer floor;

    private Integer floorsTotal;

    @Size(max = 20)
    private String buildingType;

    @Size(max = 20)
    private String renovation;

    private Boolean furnished = false;

    @NotBlank
    @Size(max = 20)
    private String phone;

    /** Telegram username (без @); при указании показывается кнопка «Написать в Telegram». */
    @Size(max = 64)
    private String telegramUsername;

    @Size(max = 100)
    private String email;

    @Size(max = 50)
    private String region;

    @Size(max = 50)
    private String district;

    private Boolean isNegotiable = false;

    private Boolean canDeliver = false;

    /** PRIVATE | STORE | DEALER | AGENT | … (BUSINESS = legacy STORE) */
    @Size(max = 32)
    private String sellerType;

    private Boolean hasLicense = false;

    private Boolean worksByContract = false;

    private Boolean urgentBargain = false;

    private Boolean giveAway = false;

    /** Онлайн-показ объекта / услуги. */
    private Boolean onlineShowing = false;

    /** Геолокация места сделки (опционально). */
    private BigDecimal locationLat;

    private BigDecimal locationLng;

    @NotNull
    private Instant expiresAt;

    private List<String> imageUrls;
}

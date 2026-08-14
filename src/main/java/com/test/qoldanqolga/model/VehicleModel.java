package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vehicle_models")
@Getter
@Setter
public class VehicleModel extends BaseEntity {

    @Column(name = "brand_id", nullable = false, length = 36)
    private String brandId;

    @Column(name = "name_uz", nullable = false, length = 255)
    private String nameUz;

    @Column(name = "name_ru", nullable = false, length = 255)
    private String nameRu;

    @Column(name = "slug", unique = true, nullable = false, length = 255)
    private String slug;

    @Column(name = "sort_order")
    private Integer sortOrder = 100;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", insertable = false, updatable = false)
    private Brand brand;
}

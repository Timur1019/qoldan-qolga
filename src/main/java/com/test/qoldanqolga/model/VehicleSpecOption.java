package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vehicle_spec_options")
@Getter
@Setter
public class VehicleSpecOption extends BaseEntity {

    /** BODY_TYPE | TRANSMISSION | FUEL_TYPE | DRIVE_TYPE | EXTERIOR_COLOR | SEATS | STEERING | OWNERS_COUNT */
    @Column(name = "group_code", nullable = false, length = 30)
    private String groupCode;

    @Column(name = "value_code", nullable = false, length = 30)
    private String valueCode;

    @Column(name = "name_uz", nullable = false, length = 100)
    private String nameUz;

    @Column(name = "name_ru", nullable = false, length = 100)
    private String nameRu;

    @Column(name = "sort_order")
    private Integer sortOrder = 100;

    @Column(name = "is_active")
    private Boolean isActive = true;
}

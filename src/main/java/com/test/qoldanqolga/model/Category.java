package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category extends BaseEntity {

    @Column(name = "name_uz", nullable = false, length = 100)
    private String nameUz;

    @Column(name = "name_ru", nullable = false, length = 100)
    private String nameRu;

    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @Column(name = "show_on_home")
    private Boolean showOnHome = false;

    @Column(name = "parent_id", length = 36)
    private String parentId;
}

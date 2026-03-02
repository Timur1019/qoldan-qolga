package com.test.qoldanqolga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "brands")
@Getter
@Setter
public class Brand extends BaseEntity {

    @Column(name = "name_uz", nullable = false, length = 255)
    private String nameUz;

    @Column(name = "name_ru", nullable = false, length = 255)
    private String nameRu;

    @Column(name = "slug", unique = true, nullable = false, length = 255)
    private String slug;

    @Column(name = "logo", length = 500)
    private String logo;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "website", length = 255)
    private String website;

    @Column(name = "sort_order")
    private Integer sortOrder = 100;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    @Column(name = "category_ids", length = 500)
    private String categoryIdsJson;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "brand_categories",
        joinColumns = @JoinColumn(name = "brand_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;

    @Column(name = "meta_title_uz")
    private String metaTitleUz;

    @Column(name = "meta_title_ru")
    private String metaTitleRu;

    @Column(name = "meta_description_uz", length = 500)
    private String metaDescriptionUz;

    @Column(name = "meta_description_ru", length = 500)
    private String metaDescriptionRu;

    @OneToMany(mappedBy = "brand")
    private List<Advertisement> ads;

    public List<String> getCategoryIds() {
        if (categoryIdsJson == null || categoryIdsJson.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(categoryIdsJson.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    public void setCategoryIds(List<String> ids) {
        this.categoryIdsJson = ids != null && !ids.isEmpty()
                ? String.join(",", ids)
                : null;
    }
}

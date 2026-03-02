package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, String> {

    List<Brand> findByIsActiveTrueOrderBySortOrderAscNameUzAsc();

    Optional<Brand> findBySlug(String slug);

    @Query("SELECT b FROM Brand b JOIN b.categories c WHERE c.code = :categoryCode AND b.isActive = true ORDER BY b.sortOrder ASC, b.nameUz ASC")
    List<Brand> findByCategoryCodeOrderBySortOrderAscNameUzAsc(@Param("categoryCode") String categoryCode);

    @Query("SELECT b FROM Brand b JOIN b.categories c WHERE c.id = :categoryId AND b.isActive = true ORDER BY b.sortOrder ASC, b.nameUz ASC")
    List<Brand> findByCategoryIdOrderBySortOrderAscNameUzAsc(@Param("categoryId") String categoryId);
}

package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByOrderBySortOrderAscNameUzAsc();

    List<Category> findByParentIdIsNullOrderBySortOrderAscNameUzAsc();

    List<Category> findByParentIdOrderBySortOrderAscNameUzAsc(Long parentId);

    List<Category> findByParentId(Long parentId);

    long countByParentId(Long parentId);

    List<Category> findByShowOnHomeTrueOrderBySortOrderAscNameUzAsc();

    Optional<Category> findByCode(String code);
}

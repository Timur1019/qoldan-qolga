package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    /** Id родительских категорий, у которых есть хотя бы одна дочерняя. Для заполнения hasChildren без N+1. */
    @Query("SELECT DISTINCT c.parentId FROM Category c WHERE c.parentId IS NOT NULL")
    List<Long> findDistinctParentIds();

    List<Category> findAllByOrderBySortOrderAscNameUzAsc();

    List<Category> findByParentIdIsNullOrderBySortOrderAscNameUzAsc();

    List<Category> findByParentIdOrderBySortOrderAscNameUzAsc(Long parentId);

    List<Category> findByParentId(Long parentId);

    long countByParentId(Long parentId);

    List<Category> findByShowOnHomeTrueOrderBySortOrderAscNameUzAsc();

    Optional<Category> findByCode(String code);
}

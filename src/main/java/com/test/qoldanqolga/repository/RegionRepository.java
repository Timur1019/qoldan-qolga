package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {

    @Query("SELECT r FROM Region r LEFT JOIN FETCH r.districts ORDER BY r.sortOrder, r.nameUz")
    List<Region> findAllWithDistrictsByOrderBySortOrderAscNameUzAsc();

    Optional<Region> findByCode(String code);
}

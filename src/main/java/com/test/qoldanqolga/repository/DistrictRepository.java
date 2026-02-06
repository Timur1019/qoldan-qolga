package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, Long> {

    List<District> findByRegionIdOrderBySortOrderAscNameUzAsc(Long regionId);
}

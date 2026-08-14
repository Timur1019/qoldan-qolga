package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleModelRepository extends JpaRepository<VehicleModel, String> {

    List<VehicleModel> findByBrandIdAndIsActiveTrueOrderBySortOrderAscNameUzAsc(String brandId);
}

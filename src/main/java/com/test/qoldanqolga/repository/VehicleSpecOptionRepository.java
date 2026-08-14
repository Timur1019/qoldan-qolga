package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.VehicleSpecOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface VehicleSpecOptionRepository extends JpaRepository<VehicleSpecOption, String> {

    List<VehicleSpecOption> findByIsActiveTrueAndDeletedAtIsNullOrderByGroupCodeAscSortOrderAsc();

    @Query("""
            select o.valueCode from VehicleSpecOption o
            where o.groupCode = :groupCode
              and o.isActive = true
              and o.deletedAt is null
            """)
    Set<String> findActiveValueCodesByGroup(@Param("groupCode") String groupCode);
}

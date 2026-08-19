package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.HomeSellBanner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomeSellBannerRepository extends JpaRepository<HomeSellBanner, String> {

    List<HomeSellBanner> findAllByDeletedAtIsNullOrderBySortOrderAscIdAsc();

    List<HomeSellBanner> findAllByEnabledTrueAndDeletedAtIsNullOrderBySortOrderAscIdAsc();
}

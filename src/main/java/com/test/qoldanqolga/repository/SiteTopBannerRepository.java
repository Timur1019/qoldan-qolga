package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.SiteTopBanner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteTopBannerRepository extends JpaRepository<SiteTopBanner, String> {

    List<SiteTopBanner> findAllByDeletedAtIsNullOrderBySortOrderAscIdAsc();

    List<SiteTopBanner> findAllByEnabledTrueAndDeletedAtIsNullOrderBySortOrderAscIdAsc();
}

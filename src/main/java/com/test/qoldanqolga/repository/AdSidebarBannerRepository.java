package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.AdSidebarBanner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdSidebarBannerRepository extends JpaRepository<AdSidebarBanner, String> {

    List<AdSidebarBanner> findAllByDeletedAtIsNullOrderBySortOrderAscIdAsc();

    List<AdSidebarBanner> findAllByEnabledTrueAndDeletedAtIsNullOrderBySortOrderAscIdAsc();
}

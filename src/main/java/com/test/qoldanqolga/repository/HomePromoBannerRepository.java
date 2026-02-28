package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.HomePromoBanner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HomePromoBannerRepository extends JpaRepository<HomePromoBanner, String> {

    List<HomePromoBanner> findAllByOrderBySortOrderAscIdAsc();
}

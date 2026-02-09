package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.AdReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdReportRepository extends JpaRepository<AdReport, Long> {

    boolean existsByAdIdAndReporterId(Long adId, String reporterId);

    List<AdReport> findByAdId(Long adId);
}

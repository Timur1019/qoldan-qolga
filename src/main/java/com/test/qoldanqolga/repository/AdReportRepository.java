package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.AdReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdReportRepository extends JpaRepository<AdReport, String> {

    boolean existsByAdIdAndReporterId(String adId, String reporterId);

    List<AdReport> findByAdId(String adId);
}

package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.AdImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdImageRepository extends JpaRepository<AdImage, Long> {

    List<AdImage> findByAdIdOrderByOrderNumAscIdAsc(Long adId);
}

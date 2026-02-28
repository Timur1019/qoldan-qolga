package com.test.qoldanqolga.repository;

import com.test.qoldanqolga.model.BusinessApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusinessApplicationRepository extends JpaRepository<BusinessApplication, String> {

    List<BusinessApplication> findAllByOrderByCreatedAtDesc();

    Page<BusinessApplication> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<BusinessApplication> findAllByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
}

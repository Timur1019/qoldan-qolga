package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdDetailDto;
import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdvertisementService {

    Page<AdListItemDto> list(String status, String category, String region, String currentUserId, Pageable pageable);

    Page<AdListItemDto> listByUser(String userId, Pageable pageable);

    AdDetailDto getById(Long id, String currentUserId);

    AdDetailDto create(CreateAdRequest request, String userId);
}

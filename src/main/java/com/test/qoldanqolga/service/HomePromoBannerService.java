package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.homepromo.CreateHomePromoBannerRequest;
import com.test.qoldanqolga.dto.homepromo.HomePromoBannerDto;
import com.test.qoldanqolga.dto.homepromo.UpdateHomePromoBannerRequest;

import java.util.List;

public interface HomePromoBannerService {

    List<HomePromoBannerDto> listForHome();

    List<HomePromoBannerDto> listForAdmin();

    HomePromoBannerDto getById(String id);

    HomePromoBannerDto create(CreateHomePromoBannerRequest request);

    HomePromoBannerDto update(String id, UpdateHomePromoBannerRequest request);

    void delete(String id);
}

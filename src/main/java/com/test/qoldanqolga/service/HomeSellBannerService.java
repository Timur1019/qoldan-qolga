package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.homesell.CreateHomeSellBannerRequest;
import com.test.qoldanqolga.dto.homesell.HomeSellBannerDto;
import com.test.qoldanqolga.dto.homesell.UpdateHomeSellBannerRequest;

import java.util.List;

public interface HomeSellBannerService {

    List<HomeSellBannerDto> listPublic();

    List<HomeSellBannerDto> listForAdmin();

    HomeSellBannerDto create(CreateHomeSellBannerRequest request);

    HomeSellBannerDto update(String id, UpdateHomeSellBannerRequest request);

    void delete(String id);
}

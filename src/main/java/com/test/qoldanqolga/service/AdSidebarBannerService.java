package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.adsidebar.AdSidebarBannerDto;
import com.test.qoldanqolga.dto.adsidebar.CreateAdSidebarBannerRequest;
import com.test.qoldanqolga.dto.adsidebar.UpdateAdSidebarBannerRequest;

import java.util.List;

public interface AdSidebarBannerService {

    List<AdSidebarBannerDto> listPublic();

    List<AdSidebarBannerDto> listForAdmin();

    AdSidebarBannerDto create(CreateAdSidebarBannerRequest request);

    AdSidebarBannerDto update(String id, UpdateAdSidebarBannerRequest request);

    void delete(String id);
}

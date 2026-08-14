package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.sitetop.CreateSiteTopBannerRequest;
import com.test.qoldanqolga.dto.sitetop.SiteTopBannerDto;
import com.test.qoldanqolga.dto.sitetop.UpdateSiteTopBannerRequest;

import java.util.List;

public interface SiteTopBannerService {

    List<SiteTopBannerDto> listPublic();

    List<SiteTopBannerDto> listForAdmin();

    SiteTopBannerDto create(CreateSiteTopBannerRequest request);

    SiteTopBannerDto update(String id, UpdateSiteTopBannerRequest request);

    void delete(String id);
}

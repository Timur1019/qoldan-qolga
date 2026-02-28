package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.business.BusinessApplicationDto;
import com.test.qoldanqolga.mapper.BusinessApplicationMapper;
import com.test.qoldanqolga.model.BusinessApplication;
import com.test.qoldanqolga.repository.BusinessApplicationRepository;
import com.test.qoldanqolga.service.BusinessApplicationService;
import com.test.qoldanqolga.service.document.DocumentStorageService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class BusinessApplicationServiceImpl implements BusinessApplicationService {

    private static final int MAX_FULL_NAME = 200;
    private static final int MAX_SHOP_NAME = 200;
    private static final int MAX_CITY = 100;
    private static final int MAX_PHONE = 30;
    private static final int MAX_SHOP_URL = 500;

    private final BusinessApplicationRepository repository;
    private final DocumentStorageService documentStorageService;
    private final BusinessApplicationMapper mapper;

    @Override
    @Transactional
    public BusinessApplicationDto create(
            String fullName,
            String shopName,
            String businessType,
            MultipartFile passportFile,
            MultipartFile registrationCertificateFile,
            String city,
            String productCategory,
            String shopUrl,
            String phone,
            boolean agreementAccepted,
            String userId
    ) {
        if (passportFile == null || passportFile.isEmpty()) {
            throw new IllegalArgumentException("Приложите сканированную копию паспорта");
        }
        if (registrationCertificateFile == null || registrationCertificateFile.isEmpty()) {
            throw new IllegalArgumentException("Приложите свидетельство о регистрации");
        }
        String passportUrl = documentStorageService.save(passportFile);
        String registrationUrl = documentStorageService.save(registrationCertificateFile);

        BusinessApplication entity = new BusinessApplication();
        entity.setUserId(userId);
        entity.setFullName(trimTo(fullName, MAX_FULL_NAME));
        entity.setShopName(trimTo(shopName, MAX_SHOP_NAME));
        entity.setBusinessType(normalizeBusinessType(businessType));
        entity.setPassportUrl(passportUrl);
        entity.setRegistrationCertificateUrl(registrationUrl);
        entity.setCity(trimTo(city, MAX_CITY));
        entity.setProductCategory(normalizeProductCategory(productCategory));
        entity.setShopUrl(trimTo(shopUrl, MAX_SHOP_URL));
        entity.setPhone(trimTo(phone, MAX_PHONE));
        entity.setAgreementAccepted(agreementAccepted);
        entity.setStatus("PENDING");

        entity = repository.save(entity);
        LogUtil.info(BusinessApplicationServiceImpl.class, "Business application created: id={} userId={}", entity.getId(), userId);
        return mapper.toDto(entity);
    }

    private static String trimTo(String s, int max) {
        if (s == null) return null;
        String t = s.trim();
        return t.length() > max ? t.substring(0, max) : t;
    }

    private static String normalizeBusinessType(String v) {
        if (v == null) return "self";
        String t = v.trim().toLowerCase();
        if ("ip".equals(t) || "ooo".equals(t)) return t;
        return "self";
    }

    private static String normalizeProductCategory(String v) {
        if (v == null) return "fashion";
        String t = v.trim().toLowerCase();
        if (t.length() > 50) t = t.substring(0, 50);
        return t.isEmpty() ? "fashion" : t;
    }
}

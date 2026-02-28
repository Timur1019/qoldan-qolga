package com.test.qoldanqolga.dto.business;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessApplicationDto {

    private String id;
    private String userId;
    private String fullName;
    private String shopName;
    private String businessType;
    private String city;
    private String productCategory;
    private String phone;
    private String shopUrl;
    private String status;
    private Instant createdAt;
    /** URL документа (для админки). */
    private String passportUrl;
    private String registrationCertificateUrl;
}

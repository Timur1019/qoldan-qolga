package com.test.qoldanqolga.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {

    private String id;
    private String email;
    private String phone;
    private String displayName;
    private String avatar;
    private java.util.List<String> avatarPhotos;
    private String role;
    private Boolean profileVerified;
    /** Подтверждённый магазин / Pro (после одобрения заявки). */
    private Boolean storeVerified;
}

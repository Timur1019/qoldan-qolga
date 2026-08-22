package com.test.qoldanqolga.dto.notification;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationPreferenceDto {

    private Boolean pushEnabled;
    private Boolean chatEnabled;
    private Boolean favoriteEnabled;
    private Boolean adEnabled;
    private Boolean promotionEnabled;
    private Boolean paymentEnabled;
    private Boolean profileEnabled;
    private Boolean dealEnabled;
    private Boolean regionalEnabled;
    private Boolean marketingEnabled;
    private Boolean quietHoursEnabled;
    private String quietHoursStart;
    private String quietHoursEnd;
}

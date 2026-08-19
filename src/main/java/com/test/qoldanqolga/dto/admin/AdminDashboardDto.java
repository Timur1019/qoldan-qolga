package com.test.qoldanqolga.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {

    private long totalUsers;
    private long verifiedUsers;
    private long pendingVerification;
    private long activeToday;
    private long registeredToday;
    private long inactiveUsers;
    private long adsToday;
    private long adsTotal;

    @Builder.Default
    private List<AdminDayStatDto> series = new ArrayList<>();
}

package com.test.qoldanqolga.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDayStatDto {

    private String date;
    private long registrations;
    private long active;
}

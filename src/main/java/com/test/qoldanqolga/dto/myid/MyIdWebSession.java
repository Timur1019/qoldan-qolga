package com.test.qoldanqolga.dto.myid;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyIdWebSession {

    private final String sessionId;
    private final String redirectUrl;
}

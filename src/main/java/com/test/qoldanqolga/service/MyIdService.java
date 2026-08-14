package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.myid.MyIdProfile;
import com.test.qoldanqolga.dto.myid.MyIdWebSession;

public interface MyIdService {

    boolean isConfigured();

    MyIdWebSession createWebSession(String passData, String birthDateIso, String ipAddress, String lang);

    MyIdProfile completeWithAuthCode(String authCode);
}

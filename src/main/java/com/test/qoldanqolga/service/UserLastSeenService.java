package com.test.qoldanqolga.service;

import com.test.qoldanqolga.model.User;

public interface UserLastSeenService {

    void touch(User user);
}

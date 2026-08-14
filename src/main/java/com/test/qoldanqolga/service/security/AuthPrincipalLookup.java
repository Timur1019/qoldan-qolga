package com.test.qoldanqolga.service.security;

import com.test.qoldanqolga.security.UserPrincipal;

public interface AuthPrincipalLookup {
    UserPrincipal findActive(String userId);
}

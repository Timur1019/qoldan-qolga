package com.test.qoldanqolga.exception;

public class SelfSubscriptionException extends BaseException {

    public SelfSubscriptionException(String userId) {
        super(ErrorCode.SELF_SUBSCRIPTION);
    }
}

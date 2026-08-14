package com.test.qoldanqolga.exception;

public class SelfReviewException extends BaseException {

    public SelfReviewException(String userId) {
        super(ErrorCode.SELF_REVIEW);
    }
}

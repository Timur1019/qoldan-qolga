package com.test.qoldanqolga.service;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Результат верификации MyID (из шага 3-A/3-B).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MyIdVerificationResult {

    private int resultCode;
    private String resultNote;
    private boolean success;

    public static MyIdVerificationResult success() {
        return new MyIdVerificationResult(1, null, true);
    }

    public static MyIdVerificationResult failure(int resultCode, String resultNote) {
        return new MyIdVerificationResult(resultCode, resultNote, false);
    }
}

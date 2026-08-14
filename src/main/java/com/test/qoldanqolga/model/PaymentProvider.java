package com.test.qoldanqolga.model;

public final class PaymentProvider {
    public static final String PAYME = "PAYME";
    public static final String CLICK = "CLICK";

    private PaymentProvider() {
    }

    public static String normalize(String raw) {
        if (raw == null) {
            return null;
        }
        String v = raw.trim().toUpperCase();
        if (PAYME.equals(v) || CLICK.equals(v)) {
            return v;
        }
        return null;
    }
}

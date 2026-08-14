package com.test.qoldanqolga.util;

import com.test.qoldanqolga.model.User;

import java.util.Locale;
import java.util.Set;

/**
 * Типы продавца и бейджи (магазин / дилер / агент / …).
 */
public final class SellerStatusUtil {

    public static final String PRIVATE = "PRIVATE";
    public static final String STORE = "STORE";
    /** Legacy-алиас магазина. */
    public static final String BUSINESS = "BUSINESS";

    private static final Set<String> NON_PRIVATE = Set.of(
            STORE, BUSINESS, "DEALER", "OFFICIAL", "SHOWROOM",
            "AGENT", "BROKER", "DEVELOPER", "COMPANY",
            "SERVICE", "STUDIO", "WHOLESALER", "MANUFACTURER",
            "BREEDER", "FARM"
    );

    private SellerStatusUtil() {}

    public static String normalize(String sellerType) {
        if (sellerType == null || sellerType.isBlank()) return null;
        String v = sellerType.trim().toUpperCase(Locale.ROOT);
        if (BUSINESS.equals(v)) return STORE;
        return v;
    }

    /**
     * «Магазин» для legacy-флага sellerIsStore:
     * аккаунт storeVerified или тип STORE/BUSINESS.
     */
    public static boolean isStore(User user, String sellerType) {
        if (user != null && Boolean.TRUE.equals(user.getStoreVerified())) {
            return true;
        }
        String n = normalize(sellerType);
        return STORE.equals(n) || BUSINESS.equalsIgnoreCase(sellerType != null ? sellerType.trim() : "");
    }

    public static boolean isStoreVerified(User user) {
        return user != null && Boolean.TRUE.equals(user.getStoreVerified());
    }

    public static boolean isPrivateType(String sellerType) {
        String n = normalize(sellerType);
        return n == null || PRIVATE.equals(n);
    }

    public static boolean isNonPrivateType(String sellerType) {
        String n = normalize(sellerType);
        return n != null && NON_PRIVATE.contains(n);
    }

    public static boolean isStoreFilter(String raw) {
        if (raw == null || raw.isBlank()) return false;
        String v = raw.trim().toUpperCase(Locale.ROOT);
        return STORE.equals(v) || BUSINESS.equals(v);
    }
}

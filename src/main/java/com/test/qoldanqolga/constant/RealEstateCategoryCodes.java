package com.test.qoldanqolga.constant;

import java.util.Set;

public final class RealEstateCategoryCodes {

    private RealEstateCategoryCodes() {
    }

    public static final String ROOT = "Nedvizhimost";
    public static final String APARTMENTS = "Kvartiry";
    public static final String HOUSES = "Doma_dachi";
    public static final String PLOTS = "Uchastki";
    public static final String COMMERCIAL = "Kommercheskaya";
    public static final String GARAGES = "Garazhi_parkovki";

    public static final String ROOMS_PLUS = "5PLUS";

    public static final Set<String> DEAL_TYPES = Set.of("SALE", "RENT");
    public static final Set<String> BUILDING_TYPES = Set.of("PANEL", "BRICK", "MONOLITH", "BLOCK", "OTHER");
    public static final Set<String> RENOVATIONS = Set.of("NEEDS_REPAIR", "COSMETIC", "EURO", "DESIGN", "NEW_BUILD");
}

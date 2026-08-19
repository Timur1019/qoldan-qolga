package com.test.qoldanqolga.util;

import java.util.ArrayList;
import java.util.List;

/**
 * CSV с ограничителями {@code ,CODE,} — чтобы фильтр LIKE не ловил подстроки.
 */
public final class CsvListUtil {

    private CsvListUtil() {
    }

    public static String join(List<String> values) {
        if (values == null || values.isEmpty()) {
            return null;
        }
        StringBuilder sb = new StringBuilder(",");
        boolean any = false;
        for (String v : values) {
            if (v == null || v.isBlank()) {
                continue;
            }
            sb.append(v.trim()).append(',');
            any = true;
        }
        return any ? sb.toString() : null;
    }

    public static List<String> split(String csv) {
        List<String> out = new ArrayList<>();
        if (csv == null || csv.isBlank()) {
            return out;
        }
        for (String part : csv.split(",")) {
            if (part != null && !part.isBlank()) {
                out.add(part.trim());
            }
        }
        return out;
    }

    public static String likeToken(String code) {
        return "%," + code.trim() + ",%";
    }
}

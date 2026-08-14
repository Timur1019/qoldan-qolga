package com.test.qoldanqolga.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Нормализация description: убирает дубли строк адреса/ориентира,
 * которые фронт раньше дописывал при каждом edit (Manzil/Адрес + Yo'nalish/Ориентир).
 */
public final class AdDescriptionLocationUtil {

    private static final Pattern ADDRESS_LINE = Pattern.compile("^(?:Адрес|Manzil)\\s*:\\s*(.+)$", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
    private static final Pattern LANDMARK_LINE = Pattern.compile("^(?:Ориентир|Yo['’]?nalish)\\s*:\\s*(.+)$", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);

    private AdDescriptionLocationUtil() {
    }

    /**
     * Оставляет текст без location-строк и один блок адреса/ориентира в конце (последние значения).
     */
    public static String normalize(String raw) {
        if (raw == null) {
            return null;
        }
        String text = raw.replace("\r\n", "\n").trim();
        if (text.isEmpty()) {
            return text;
        }

        String[] lines = text.split("\n", -1);
        List<String> kept = new ArrayList<>();
        String address = null;
        String landmark = null;
        boolean addressRu = true;
        boolean landmarkRu = true;

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) {
                kept.add(line);
                continue;
            }
            Matcher addr = ADDRESS_LINE.matcher(trimmed);
            if (addr.matches()) {
                address = addr.group(1).trim();
                addressRu = trimmed.regionMatches(true, 0, "Адрес", 0, "Адрес".length());
                continue;
            }
            Matcher mark = LANDMARK_LINE.matcher(trimmed);
            if (mark.matches()) {
                landmark = mark.group(1).trim();
                landmarkRu = trimmed.regionMatches(true, 0, "Ориентир", 0, "Ориентир".length());
                continue;
            }
            kept.add(line);
        }

        String body = String.join("\n", kept).replaceAll("\n{3,}", "\n\n").trim();
        if ((address == null || address.isBlank()) && (landmark == null || landmark.isBlank())) {
            return body.isEmpty() ? text : body;
        }

        List<String> loc = new ArrayList<>(2);
        if (address != null && !address.isBlank()) {
            loc.add((addressRu ? "Адрес: " : "Manzil: ") + address);
        }
        if (landmark != null && !landmark.isBlank()) {
            loc.add((landmarkRu ? "Ориентир: " : "Yo'nalish: ") + landmark);
        }
        String block = String.join("\n", loc);
        return body.isEmpty() ? block : body + "\n\n" + block;
    }
}

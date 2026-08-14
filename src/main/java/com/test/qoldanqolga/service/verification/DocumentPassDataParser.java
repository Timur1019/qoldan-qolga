package com.test.qoldanqolga.service.verification;

import com.test.qoldanqolga.exception.ValidationException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

public final class DocumentPassDataParser {

    private static final Pattern SERIES = Pattern.compile("^[A-Z]{2}$");
    private static final Pattern NUMBER = Pattern.compile("^\\d{5,7}$");
    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE;

    private DocumentPassDataParser() {
    }

    public static String passData(String seriesRaw, String numberRaw) {
        String series = normalizeSeries(seriesRaw);
        String number = normalizeNumber(numberRaw);
        if (!SERIES.matcher(series).matches()) {
            throw new ValidationException(List.of("Серия: 2 латинские буквы, например AB"));
        }
        if (!NUMBER.matcher(number).matches()) {
            throw new ValidationException(List.of("Номер: от 5 до 7 цифр"));
        }
        return series + padNumber(number);
    }

    public static String birthDateIso(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new ValidationException(List.of("Укажите дату рождения"));
        }
        String value = raw.trim();
        if (value.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return validateIso(value);
        }
        String[] parts = value.split("[./-]");
        if (parts.length != 3) {
            throw new ValidationException(List.of("Дата рождения в формате ДД.ММ.ГГГГ"));
        }
        String iso = pad(parts[2], 4) + "-" + pad(parts[1], 2) + "-" + pad(parts[0], 2);
        return validateIso(iso);
    }

    private static String validateIso(String iso) {
        try {
            LocalDate date = LocalDate.parse(iso, ISO);
            if (date.isAfter(LocalDate.now().minusYears(14)) || date.isBefore(LocalDate.now().minusYears(120))) {
                throw new ValidationException(List.of("Проверьте дату рождения"));
            }
            return date.format(ISO);
        } catch (DateTimeParseException e) {
            throw new ValidationException(List.of("Дата рождения в формате ДД.ММ.ГГГГ"));
        }
    }

    private static String normalizeSeries(String seriesRaw) {
        return seriesRaw == null ? "" : seriesRaw.replaceAll("\\s+", "").toUpperCase(Locale.ROOT);
    }

    private static String normalizeNumber(String numberRaw) {
        return numberRaw == null ? "" : numberRaw.replaceAll("\\D", "");
    }

    private static String padNumber(String number) {
        if (number.length() >= 7) {
            return number.substring(0, 7);
        }
        return "0".repeat(7 - number.length()) + number;
    }

    private static String pad(String value, int length) {
        String digits = value.replaceAll("\\D", "");
        if (digits.length() >= length) {
            return digits.substring(digits.length() - length);
        }
        return "0".repeat(length - digits.length()) + digits;
    }
}

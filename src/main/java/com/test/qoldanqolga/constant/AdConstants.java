package com.test.qoldanqolga.constant;

/**
 * Константы для объявлений. Исключает «магические строки» из сервисов.
 */
public final class AdConstants {

    private AdConstants() {
    }

    /** Статус объявления по умолчанию при создании и при фильтрации списка. */
    public static final String STATUS_ACTIVE = "ACTIVE";

    /** Статус объявления в архиве (закрыто). */
    public static final String STATUS_ARCHIVED = "ARCHIVED";

    /** Валюта по умолчанию. */
    public static final String CURRENCY_DEFAULT = "UZS";

    /** Код категории по умолчанию при создании объявления. */
    public static final String CATEGORY_DEFAULT = "Xizmatlar";
}

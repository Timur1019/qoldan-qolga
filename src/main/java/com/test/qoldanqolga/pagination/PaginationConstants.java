package com.test.qoldanqolga.pagination;

import org.springframework.data.domain.Sort;

/**
 * Константы пагинации.
 */
public final class PaginationConstants {

    private PaginationConstants() {
    }

    public static final int DEFAULT_LIMIT = 20;
    public static final int MAX_LIMIT = 100;
    /** Дополнительная запись для проверки hasNext. */
    public static final int FETCH_EXTRA = 1;
    public static final String CURSOR_SORT_FIELD = "id";
    public static final Sort.Direction CURSOR_SORT_DIRECTION = Sort.Direction.ASC;
}

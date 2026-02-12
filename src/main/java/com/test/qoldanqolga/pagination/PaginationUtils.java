package com.test.qoldanqolga.pagination;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Утилиты пагинации.
 */
public final class PaginationUtils {

    private PaginationUtils() {
    }

    public static int normalizeLimit(Integer limit) {
        if (limit == null) return PaginationConstants.DEFAULT_LIMIT;
        return Math.max(1, Math.min(limit, PaginationConstants.MAX_LIMIT));
    }

    public static Pageable createCursorPageable(int limit) {
        return PageRequest.of(0, limit + PaginationConstants.FETCH_EXTRA,
                Sort.by(PaginationConstants.CURSOR_SORT_DIRECTION, PaginationConstants.CURSOR_SORT_FIELD));
    }
}

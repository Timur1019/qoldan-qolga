package com.test.qoldanqolga.pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Запрос курсорной пагинации.
 * cursor — последний ID или timestamp, после которого запрашиваются записи.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CursorPageRequest {

    /** Курсор (id последней записи на предыдущей странице, или null для первой страницы) */
    private String cursor;

    /** Максимальное количество записей на странице */
    @Builder.Default
    private int limit = 20;

    public static CursorPageRequest of(String cursor, int limit) {
        return CursorPageRequest.builder()
                .cursor(cursor)
                .limit(Math.max(1, Math.min(limit, 100)))
                .build();
    }

    public static CursorPageRequest first(int limit) {
        return CursorPageRequest.of(null, limit);
    }
}

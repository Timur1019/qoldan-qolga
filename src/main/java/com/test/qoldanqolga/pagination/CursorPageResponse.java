package com.test.qoldanqolga.pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

/**
 * Ответ курсорной пагинации.
 *
 * @param <T> тип элемента контента
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CursorPageResponse<T> {

    /** Список элементов текущей страницы */
    private List<T> content;

    /** Курсор для следующей страницы (id последнего элемента или null, если нет следующей) */
    private String nextCursor;

    /** Есть ли следующая страница */
    private boolean hasNext;

    public static <T> CursorPageResponse<T> of(List<T> content, String nextCursor) {
        return CursorPageResponse.<T>builder()
                .content(content != null ? content : Collections.emptyList())
                .nextCursor(nextCursor)
                .hasNext(nextCursor != null)
                .build();
    }

    public static <T> CursorPageResponse<T> empty() {
        return CursorPageResponse.of(Collections.emptyList(), null);
    }
}

package com.test.qoldanqolga.service.component;

import com.test.qoldanqolga.pagination.CursorPageResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;


@Component
public class CursorPaginationProcessor {

    public <T, DTO> CursorPageResponse<DTO> process(
            List<T> content,
            int limit,
            Function<List<T>, List<DTO>> mapper,
            Function<T, String> cursorExtractor) {

        if (content == null || content.isEmpty()) {
            return CursorPageResponse.empty();
        }

        boolean hasNext = content.size() > limit;
        List<T> pageContent = hasNext ? content.subList(0, limit) : content;
        String nextCursor = hasNext ? cursorExtractor.apply(pageContent.get(pageContent.size() - 1)) : null;

        return CursorPageResponse.of(mapper.apply(pageContent), nextCursor);
    }
}

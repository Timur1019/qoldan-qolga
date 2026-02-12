package com.test.qoldanqolga.service.reference.cache;

import com.test.qoldanqolga.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Кэш ID родительских категорий, у которых есть дети.
 * Используется для hasChildren без N+1 запросов.
 */
@Component
@RequiredArgsConstructor
public class CategoryParentCache {

    private final CategoryRepository categoryRepository;

    @Cacheable(value = "categoryParents", unless = "#result.isEmpty()")
    public Set<String> getParentIdsWithChildren() {
        return categoryRepository.findDistinctParentIds().stream()
                .collect(Collectors.toSet());
    }
}

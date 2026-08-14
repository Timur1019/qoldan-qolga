package com.test.qoldanqolga.service.component;

import com.test.qoldanqolga.model.Category;
import com.test.qoldanqolga.repository.CategoryRepository;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Разрешение кодов категорий для фильтрации (включая дочерние).
 */
@Component
@RequiredArgsConstructor
public class CategoryResolver {

    private final CategoryRepository categoryRepository;

    /**
     * Возвращает список кодов для фильтрации: выбранная категория + все потомки (рекурсивно).
     * При выборе «Электроника» вернёт Elektronika, Telefonlar_aloqa, Mobil_telefonlar, Televizorlar и т.д. —
     * чтобы выводились все объявления из раздела и подразделов.
     */
    @Cacheable(value = "categoryCodes", key = "#categoryCode", condition = "#categoryCode != null && !#categoryCode.isBlank()")
    public List<String> resolveCategoryCodes(String categoryCode) {
        if (categoryCode == null || categoryCode.isBlank()) {
            return null;
        }
        List<String> codes = categoryRepository.findByCode(categoryCode)
                .map(cat -> {
                    List<String> result = new ArrayList<>();
                    result.add(cat.getCode());
                    collectDescendantCodes(cat.getId(), result);
                    return result;
                })
                .orElse(List.of(categoryCode));
        LogUtil.debug(CategoryResolver.class, "Category resolved: code={} resultSize={}", categoryCode, codes.size());
        return codes;
    }

    /** Рекурсивно добавляет коды всех дочерних категорий в result. */
    private void collectDescendantCodes(String parentId, List<String> result) {
        if (parentId == null || parentId.isBlank()) {
            return;
        }
        List<Category> children = categoryRepository.findByParentIdOrderBySortOrderAscNameUzAsc(parentId);
        for (Category child : children) {
            if (child.getCode() != null && !result.contains(child.getCode())) {
                result.add(child.getCode());
                collectDescendantCodes(child.getId(), result);
            }
        }
    }
}

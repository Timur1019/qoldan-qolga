package com.test.qoldanqolga.service.component;

import com.test.qoldanqolga.model.Category;
import com.test.qoldanqolga.repository.CategoryRepository;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
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
     * Возвращает список кодов для фильтрации: выбранная категория + её дочерние + код родителя (если есть).
     * Так объявления с категорией родителя (например Xizmatlar) отображаются и при выборе подкатегории.
     */
    public List<String> resolveCategoryCodes(String categoryCode) {
        if (categoryCode == null || categoryCode.isBlank()) {
            return null;
        }
        List<String> codes = categoryRepository.findByCode(categoryCode)
                .map(cat -> {
                    List<String> result = new ArrayList<>();
                    result.add(cat.getCode());
                    categoryRepository.findByParentId(cat.getId()).stream()
                            .map(Category::getCode)
                            .forEach(result::add);
                    if (cat.getParentId() != null && !cat.getParentId().isBlank()) {
                        categoryRepository.findById(cat.getParentId())
                                .map(Category::getCode)
                                .ifPresent(parentCode -> {
                                    if (!result.contains(parentCode)) {
                                        result.add(parentCode);
                                    }
                                });
                    }
                    return result;
                })
                .orElse(List.of(categoryCode));
        LogUtil.debug(CategoryResolver.class, "Category resolved: code={} resultSize={}", categoryCode, codes.size());
        return codes;
    }
}

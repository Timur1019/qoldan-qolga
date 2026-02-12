package com.test.qoldanqolga.service.component;

import com.test.qoldanqolga.model.Category;
import com.test.qoldanqolga.repository.CategoryRepository;
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
     * Возвращает список кодов: родитель + дочерние категории, или [categoryCode] если не найден.
     */
    public List<String> resolveCategoryCodes(String categoryCode) {
        if (categoryCode == null || categoryCode.isBlank()) {
            return null;
        }
        return categoryRepository.findByCode(categoryCode)
                .map(parent -> {
                    List<String> codes = new ArrayList<>();
                    codes.add(parent.getCode());
                    categoryRepository.findByParentId(parent.getId()).stream()
                            .map(Category::getCode)
                            .forEach(codes::add);
                    return codes;
                })
                .orElse(List.of(categoryCode));
    }
}

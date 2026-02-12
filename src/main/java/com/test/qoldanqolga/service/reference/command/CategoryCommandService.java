package com.test.qoldanqolga.service.reference.command;

import com.test.qoldanqolga.dto.reference.CreateCategoryRequest;
import com.test.qoldanqolga.exception.ConflictException;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.model.Category;
import com.test.qoldanqolga.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.test.qoldanqolga.service.reference.CategoryDefaults.DEFAULT_SORT_ORDER;

/**
 * Создание и валидация категорий. Отдельная ответственность.
 */
@Service
@RequiredArgsConstructor
public class CategoryCommandService {

    private final CategoryRepository categoryRepository;

    @Transactional
    @CacheEvict(value = "categoryParents", allEntries = true)
    public Category createCategory(CreateCategoryRequest request) {
        validateUniqueCode(request.getCode());
        validateParent(request.getParentId());

        Category category = new Category();
        category.setNameUz(safeTrim(request.getNameUz()));
        category.setNameRu(safeTrim(request.getNameRu()));
        category.setCode(safeTrim(request.getCode()));
        category.setParentId(request.getParentId());
        category.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : DEFAULT_SORT_ORDER);
        category.setShowOnHome(Boolean.TRUE.equals(request.getShowOnHome()));

        return categoryRepository.save(category);
    }

    private void validateUniqueCode(String code) {
        String normalized = safeTrim(code);
        if (categoryRepository.findByCode(normalized).isPresent()) {
            throw new ConflictException("Категория с кодом «" + normalized + "» уже существует");
        }
    }

    private void validateParent(String parentId) {
        if (parentId != null) {
            categoryRepository.findById(parentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Родительская категория", parentId));
        }
    }

    private static String safeTrim(String value) {
        return value != null ? value.trim() : "";
    }
}

package com.test.qoldanqolga.mapper;

import com.test.qoldanqolga.dto.reference.CategoryDto;
import com.test.qoldanqolga.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface CategoryMapper extends BaseMapper<Category, CategoryDto> {

    @Override
    default CategoryDto toDto(Category category) {
        return toDto(category, false);
    }

    @Mapping(target = "hasChildren", source = "hasChildren")
    CategoryDto toDto(Category category, boolean hasChildren);

    default CategoryDto toDto(Category category, Set<String> parentIdsWithChildren) {
        boolean hasChildren = parentIdsWithChildren != null && parentIdsWithChildren.contains(category.getId());
        return toDto(category, hasChildren);
    }

    default List<CategoryDto> toDtoList(List<Category> categories, Set<String> parentIdsWithChildren) {
        if (categories == null) return null;
        return categories.stream()
                .map(c -> toDto(c, parentIdsWithChildren))
                .toList();
    }
}

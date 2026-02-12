package com.test.qoldanqolga.dto.reference;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCategoryRequest {

    @NotBlank(message = "Название (UZ) обязательно")
    @Size(max = 100)
    private String nameUz;

    @NotBlank(message = "Название (RU) обязательно")
    @Size(max = 100)
    private String nameRu;

    @NotBlank(message = "Код категории обязателен")
    @Size(max = 50)
    private String code;

    /** ID родительской категории; null — корневая категория */
    private String parentId;

    private Integer sortOrder = 0;

    private Boolean showOnHome = false;
}

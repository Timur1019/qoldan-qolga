package com.test.qoldanqolga.validator;

import java.util.List;

/**
 * Интерфейс валидатора. Разделяет валидацию по назначению (Interface Segregation).
 *
 * @param <T> тип валидируемого объекта
 */
public interface Validator<T> {

    /**
     * Валидирует объект. Возвращает список сообщений об ошибках (пустой при успехе).
     */
    List<String> validate(T object);
}

package com.test.qoldanqolga.service.document;

import org.springframework.web.multipart.MultipartFile;

/**
 * Сохранение документов (сканы, PDF) для заявок «для бизнеса».
 * Без проверки содержимого как изображение — разрешены PDF и картинки.
 */
public interface DocumentStorageService {

    /**
     * Сохраняет файл в хранилище документов. Проверяются только размер и расширение.
     *
     * @return URL для доступа к файлу (например /docs/uuid.pdf)
     */
    String save(MultipartFile file);
}

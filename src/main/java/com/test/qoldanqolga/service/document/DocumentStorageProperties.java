package com.test.qoldanqolga.service.document;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Настройки хранилища документов (сканы паспорта, свидетельства и т.д.).
 * Отдельно от app.upload — без проверки «только картинки», разрешены PDF и изображения.
 */
@Data
@Component
@ConfigurationProperties(prefix = "app.docs")
public class DocumentStorageProperties {

    private String dir = "uploads/docs";
    private String urlPrefix = "/docs/";
    private String defaultExtension = ".pdf";
    /** Расширения: изображения + PDF */
    private Set<String> allowedExtensions = Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf");
    private long maxFileSize = 20 * 1024 * 1024; // 20MB
}

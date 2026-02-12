package com.test.qoldanqolga.service.image;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Set;

@Data
@Component
@ConfigurationProperties(prefix = "app.upload")
public class StorageProperties {

    private String dir = "uploads";
    private String urlPrefix = "/uploads/";
    private String defaultExtension = ".jpg";
    private Set<String> allowedExtensions = Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp");
    private long maxFileSize = 5_242_880; // 5MB
}

package com.test.qoldanqolga.service.document.impl;

import com.test.qoldanqolga.exception.FileTooLargeException;
import com.test.qoldanqolga.exception.ImageStorageException;
import com.test.qoldanqolga.service.document.DocumentStorageProperties;
import com.test.qoldanqolga.service.document.DocumentStorageService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalDocumentStorageServiceImpl implements DocumentStorageService {

    private final DocumentStorageProperties properties;

    @Override
    public String save(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Файл пустой");
        }
        if (file.getSize() > properties.getMaxFileSize()) {
            long maxMb = properties.getMaxFileSize() / (1024 * 1024);
            throw new FileTooLargeException("Максимальный размер файла: " + maxMb + " MB");
        }
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            throw new IllegalArgumentException("Имя файла отсутствует");
        }
        String ext = getExtension(originalName);
        if (ext.isEmpty()) {
            ext = properties.getDefaultExtension();
        } else if (!isAllowedExtension(ext)) {
            throw new IllegalArgumentException("Неподдерживаемый формат файла: " + ext + ". Разрешены: изображения (jpg, png и др.) и PDF.");
        }

        String filename = UUID.randomUUID() + ext;
        Path dir = Paths.get(properties.getDir()).toAbsolutePath().normalize();

        try {
            Files.createDirectories(dir);
            Path target = dir.resolve(filename);
            file.transferTo(target);
            String url = properties.getUrlPrefix() + filename;
            LogUtil.debug(LocalDocumentStorageServiceImpl.class, "Saved document: {}", url);
            return url;
        } catch (IOException e) {
            LogUtil.error(LocalDocumentStorageServiceImpl.class, "Failed to save document", e);
            throw new ImageStorageException("Не удалось сохранить файл", e);
        }
    }

    private static String getExtension(String filename) {
        if (filename == null || filename.isBlank()) return "";
        int i = filename.lastIndexOf('.');
        return i > 0 ? filename.substring(i).toLowerCase() : "";
    }

    private boolean isAllowedExtension(String ext) {
        String normalized = ext.startsWith(".") ? ext : "." + ext;
        return properties.getAllowedExtensions().stream()
                .anyMatch(e -> e.equalsIgnoreCase(normalized));
    }
}

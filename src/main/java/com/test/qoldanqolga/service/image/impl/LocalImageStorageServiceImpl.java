package com.test.qoldanqolga.service.image.impl;

import com.test.qoldanqolga.exception.ImageStorageException;
import com.test.qoldanqolga.exception.InvalidImageException;
import com.test.qoldanqolga.service.image.ImageStorageService;
import com.test.qoldanqolga.service.image.ImageValidator;
import com.test.qoldanqolga.service.image.StorageProperties;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class LocalImageStorageServiceImpl implements ImageStorageService {

    private final StorageProperties properties;
    private final ImageValidator imageValidator;

    @Override
    public String save(MultipartFile file) {
        imageValidator.validate(file);

        String ext = getExtension(file.getOriginalFilename());
        if (ext.isEmpty() || !isAllowedExtension(ext)) {
            ext = properties.getDefaultExtension();
        }
        String filename = UUID.randomUUID() + ext;
        Path dir = Paths.get(properties.getDir()).toAbsolutePath().normalize();

        try {
            Files.createDirectories(dir);
            Path target = dir.resolve(filename);
            file.transferTo(target);
            try {
                imageValidator.validateImageContent(target);
            } catch (InvalidImageException e) {
                Files.deleteIfExists(target);
                throw e;
            }
            String url = properties.getUrlPrefix() + filename;
            LogUtil.debug(LocalImageStorageServiceImpl.class, "Saved image: {}", url);
            return url;
        } catch (IOException e) {
            LogUtil.error(LocalImageStorageServiceImpl.class, "Failed to save upload", e);
            throw new ImageStorageException("Не удалось сохранить файл", e);
        }
    }

    @Override
    public List<String> saveAll(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }
        List<CompletableFuture<String>> futures = files.stream()
                .map(file -> CompletableFuture.supplyAsync(() -> save(file)))
                .toList();
        List<String> urls = new ArrayList<>(futures.size());
        for (CompletableFuture<String> f : futures) {
            try {
                urls.add(f.join());
            } catch (Exception e) {
                LogUtil.warn(LocalImageStorageServiceImpl.class, "Batch upload partial failure: {}", e.getMessage());
                throw new ImageStorageException("Ошибка загрузки одного из файлов", e);
            }
        }
        return urls;
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

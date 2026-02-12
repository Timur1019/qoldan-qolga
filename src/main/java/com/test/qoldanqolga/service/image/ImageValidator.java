package com.test.qoldanqolga.service.image;

import com.test.qoldanqolga.exception.FileTooLargeException;
import com.test.qoldanqolga.exception.InvalidImageException;
import com.test.qoldanqolga.exception.UnsupportedImageFormatException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

@Component
@RequiredArgsConstructor
public class ImageValidator {

    private final StorageProperties properties;

    private static final int MAX_IMAGE_DIMENSION = 5000;

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidImageException("Файл пустой");
        }
        if (file.getSize() > properties.getMaxFileSize()) {
            long maxMb = properties.getMaxFileSize() / (1024 * 1024);
            throw new FileTooLargeException("Максимальный размер файла: " + maxMb + " MB");
        }
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            throw new InvalidImageException("Имя файла отсутствует");
        }
        String ext = getExtension(originalName).toLowerCase();
        if (ext.isEmpty()) {
            throw new UnsupportedImageFormatException("(без расширения)");
        }
        String extWithDot = ext.startsWith(".") ? ext : "." + ext;
        if (!properties.getAllowedExtensions().stream()
                .anyMatch(e -> e.equalsIgnoreCase(extWithDot))) {
            throw new UnsupportedImageFormatException(extWithDot);
        }
    }

    public void validateImageContent(java.nio.file.Path filePath) {
        try (InputStream is = java.nio.file.Files.newInputStream(filePath)) {
            BufferedImage image = ImageIO.read(is);
            if (image == null) {
                throw new InvalidImageException("Файл не является изображением");
            }
            if (image.getWidth() > MAX_IMAGE_DIMENSION || image.getHeight() > MAX_IMAGE_DIMENSION) {
                throw new InvalidImageException("Размер изображения превышает " + MAX_IMAGE_DIMENSION + "px");
            }
        } catch (IOException e) {
            throw new InvalidImageException("Не удалось прочитать файл изображения");
        }
    }

    private static String getExtension(String filename) {
        int i = filename.lastIndexOf('.');
        return i > 0 ? filename.substring(i).toLowerCase() : "";
    }
}

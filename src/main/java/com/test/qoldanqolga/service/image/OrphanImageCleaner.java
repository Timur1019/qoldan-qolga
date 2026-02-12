package com.test.qoldanqolga.service.image;

import com.test.qoldanqolga.repository.AdImageRepository;
import com.test.qoldanqolga.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Stream;

/**
 * Очистка неиспользуемых изображений из папки uploads.
 * Запускается каждый день в 3:00.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OrphanImageCleaner {

    private final StorageProperties storageProperties;
    private final AdImageRepository adImageRepository;
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional(readOnly = true)
    public void cleanOrphanedImages() {
        Path uploadDir = Paths.get(storageProperties.getDir()).toAbsolutePath().normalize();
        if (!Files.exists(uploadDir) || !Files.isDirectory(uploadDir)) {
            return;
        }

        Set<String> usedFilenames = collectUsedFilenames();
        int deleted = 0;

        try (Stream<Path> files = Files.list(uploadDir)) {
            for (Path path : files.filter(Files::isRegularFile).toList()) {
                String filename = path.getFileName().toString();
                if (!usedFilenames.contains(filename)) {
                    try {
                        Files.delete(path);
                        deleted++;
                        log.info("Deleted orphaned image: {}", filename);
                    } catch (IOException e) {
                        log.error("Failed to delete orphaned image: {}", filename, e);
                    }
                }
            }
        } catch (IOException e) {
            log.error("Failed to list upload directory", e);
        }

        if (deleted > 0) {
            log.info("Orphan image cleanup completed: {} files deleted", deleted);
        }
    }

    private Set<String> collectUsedFilenames() {
        Set<String> used = new HashSet<>();
        String prefix = storageProperties.getUrlPrefix();

        adImageRepository.findAll().forEach(img -> {
            String url = img.getUrl();
            if (url != null && url.startsWith(prefix)) {
                used.add(url.substring(prefix.length()));
            }
        });

        userRepository.findAll().forEach(user -> {
            String avatar = user.getAvatar();
            if (avatar != null && avatar.startsWith(prefix)) {
                used.add(avatar.substring(prefix.length()));
            }
        });

        return used;
    }
}

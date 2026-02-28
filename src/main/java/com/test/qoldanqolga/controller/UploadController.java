package com.test.qoldanqolga.controller;

import com.test.qoldanqolga.service.image.ImageStorageService;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/ads")
@Tag(name = "Загрузка", description = "Загрузка изображений для объявлений")
@RequiredArgsConstructor
public class UploadController {

    private final ImageStorageService imageStorageService;

    @Operation(summary = "Загрузить изображение", description = "Возвращает URL загруженного файла")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Неверный формат"),
            @ApiResponse(responseCode = "500", description = "Ошибка сервера")
    })
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        try {
            String url = imageStorageService.save(file);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IllegalArgumentException e) {
            LogUtil.warn(UploadController.class, "Upload rejected: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            LogUtil.error(UploadController.class, "Upload failed", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

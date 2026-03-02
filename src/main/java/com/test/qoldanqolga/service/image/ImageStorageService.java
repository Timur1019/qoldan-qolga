package com.test.qoldanqolga.service.image;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageStorageService {

    String save(MultipartFile file);

    List<String> saveAll(List<MultipartFile> files);
}

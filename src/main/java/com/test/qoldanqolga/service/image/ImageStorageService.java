package com.test.qoldanqolga.service.image;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    String save(MultipartFile file);
}

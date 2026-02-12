package com.test.qoldanqolga.service;

/**
 * Управление статусами объявлений (archive, restore).
 */
public interface AdStatusService {

    void archive(String id, String userId);

    void restore(String id, String userId);
}

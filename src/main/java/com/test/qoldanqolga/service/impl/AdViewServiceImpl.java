package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.service.AdViewService;
import com.test.qoldanqolga.service.AdViewWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdViewServiceImpl implements AdViewService {

    private final AdViewWriter adViewWriter;

    @Override
    @Async("viewExecutor")
    public void recordViewAsync(String adId) {
        adViewWriter.increment(adId);
    }
}

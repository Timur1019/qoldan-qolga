package com.test.qoldanqolga.service.push;

import java.util.Map;

public interface ExpoPushClient {

    void send(String to, String title, String body, Map<String, Object> data, String channelId);
}

package com.test.qoldanqolga.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AppPublicProperties {

    private String publicUrl = "http://localhost:3000";
}

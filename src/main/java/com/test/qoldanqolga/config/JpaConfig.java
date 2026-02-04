package com.test.qoldanqolga.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA: аудит полей created_at/updated_at.
 * Liquibase по умолчанию выполняется при инициализации DataSource до старта JPA.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}

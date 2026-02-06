package com.test.qoldanqolga.config;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA: аудит полей + порядок инициализации: EntityManagerFactory создаётся после Liquibase,
 * чтобы миграции (в т.ч. колонка role) успели выполниться до валидации схемы Hibernate.
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {

    @Bean
    public static BeanFactoryPostProcessor entityManagerFactoryDependsOnLiquibase() {
        return beanFactory -> {
            if (!(beanFactory instanceof BeanDefinitionRegistry registry)) return;
            if (!registry.containsBeanDefinition("entityManagerFactory")) return;
            BeanDefinition bd = registry.getBeanDefinition("entityManagerFactory");
            String[] deps = bd.getDependsOn();
            if (deps == null) {
                bd.setDependsOn("liquibase");
            } else {
                String[] next = new String[deps.length + 1];
                System.arraycopy(deps, 0, next, 0, deps.length);
                next[deps.length] = "liquibase";
                bd.setDependsOn(next);
            }
        };
    }
}

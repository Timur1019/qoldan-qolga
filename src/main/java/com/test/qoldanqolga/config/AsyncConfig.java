package com.test.qoldanqolga.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "imageExecutor")
    public Executor imageExecutor() {
        return buildExecutor("img-", 4, 8, 80);
    }

    @Bean(name = "ioExecutor")
    public Executor ioExecutor() {
        return buildExecutor("io-", 2, 6, 50);
    }

    @Bean(name = "viewExecutor")
    public Executor viewExecutor() {
        return buildExecutor("view-", 2, 8, 500);
    }

    @Bean(name = "pushExecutor")
    public Executor pushExecutor() {
        return buildExecutor("push-", 2, 6, 200);
    }

    private static Executor buildExecutor(String prefix, int core, int max, int queue) {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setThreadNamePrefix(prefix);
        executor.setCorePoolSize(core);
        executor.setMaxPoolSize(max);
        executor.setQueueCapacity(queue);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}

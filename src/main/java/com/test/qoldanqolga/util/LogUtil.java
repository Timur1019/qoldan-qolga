package com.test.qoldanqolga.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Утилита логирования. Единая точка для всех сервисов.
 * Не разбрасывать log по классам — использовать LogUtil.
 */
public final class LogUtil {

    private LogUtil() {
    }

    public static void info(Class<?> clazz, String message, Object... args) {
        getLogger(clazz).info(message, args);
    }

    public static void debug(Class<?> clazz, String message, Object... args) {
        getLogger(clazz).debug(message, args);
    }

    public static void warn(Class<?> clazz, String message, Object... args) {
        getLogger(clazz).warn(message, args);
    }

    public static void error(Class<?> clazz, String message, Object... args) {
        getLogger(clazz).error(message, args);
    }

    public static void error(Class<?> clazz, String message, Throwable t) {
        getLogger(clazz).error(message, t);
    }

    private static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }
}

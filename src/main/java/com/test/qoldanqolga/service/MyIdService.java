package com.test.qoldanqolga.service;

/**
 * Интеграция с MyID (биометрическая идентификация).
 * Учётные данные и вызовы API только на бэкенде.
 */
public interface MyIdService {

    /**
     * Проверяет, настроена ли интеграция (есть client_id, username, password).
     */
    boolean isConfigured();

    /**
     * Создаёт задачу идентификации в MyID и ждёт результат.
     *
     * @param passData   серия (заглавные латинские буквы) + номер документа, макс 10 символов
     * @param birthDate  дата рождения YYYY-MM-DD
     * @param photoBase64 Data URI фото лица (data:image/jpeg;base64,...)
     * @return result_code из MyID (1 = успех)
     */
    MyIdVerificationResult verify(String passData, String birthDate, String photoBase64);
}

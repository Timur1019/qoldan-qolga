package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.business.BusinessApplicationDto;
import org.springframework.web.multipart.MultipartFile;

/**
 * Заявки на статус «Магазин» (Qoldan Qolga для бизнеса).
 */
public interface BusinessApplicationService {

    /**
     * Создать заявку. Файлы паспорта и свидетельства загружаются и сохраняются.
     *
     * @param fullName                    ФИО
     * @param shopName                    Название магазина
     * @param businessType                self / ip / ooo
     * @param passportFile                Скан паспорта
     * @param registrationCertificateFile Свидетельство о регистрации
     * @param city                        Город
     * @param productCategory             Категория товаров (services, fashion, …)
     * @param shopUrl                     Ник в соцсетях / Telegram (опционально)
     * @param phone                       Телефон
     * @param agreementAccepted           Согласие с условиями
     * @param userId                      ID пользователя (если авторизован), иначе null
     * @return созданная заявка
     */
    BusinessApplicationDto create(
            String fullName,
            String shopName,
            String businessType,
            MultipartFile passportFile,
            MultipartFile registrationCertificateFile,
            String city,
            String productCategory,
            String shopUrl,
            String phone,
            boolean agreementAccepted,
            String userId
    );
}

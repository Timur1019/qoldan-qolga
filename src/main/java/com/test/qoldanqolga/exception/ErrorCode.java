package com.test.qoldanqolga.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Требуется авторизация"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Доступ запрещён"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Неверный email или пароль"),
    INVALID_OTP(HttpStatus.UNAUTHORIZED, "Неверный код подтверждения"),
    OTP_EXPIRED(HttpStatus.BAD_REQUEST, "Код истёк или не найден. Запросите новый"),
    OTP_TOO_MANY_ATTEMPTS(HttpStatus.BAD_REQUEST, "Слишком много попыток. Запросите новый код"),
    OTP_RATE_LIMITED(HttpStatus.TOO_MANY_REQUESTS, "Слишком частые запросы SMS. Подождите"),
    PHONE_INVALID(HttpStatus.BAD_REQUEST, "Некорректный номер телефона"),
    SMS_NOT_CONFIGURED(HttpStatus.BAD_REQUEST, "SMS-сервис не настроен"),
    SMS_SEND_FAILED(HttpStatus.BAD_GATEWAY, "Не удалось отправить SMS"),
    ACCOUNT_UNAVAILABLE(HttpStatus.UNAUTHORIZED, "Аккаунт недоступен"),
    ACCOUNT_BANNED(HttpStatus.UNAUTHORIZED, "Аккаунт заблокирован"),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "Пользователь с таким email уже зарегистрирован"),
    CONFLICT(HttpStatus.CONFLICT, "Конфликт данных"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Ресурс не найден"),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "Ошибка валидации"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "Ошибка запроса"),
    AD_ACCESS_DENIED(HttpStatus.FORBIDDEN, "Нет доступа к объявлению"),
    CHAT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "Нет доступа к диалогу"),
    SELF_SUBSCRIPTION(HttpStatus.BAD_REQUEST, "Нельзя подписаться на самого себя"),
    SELF_REVIEW(HttpStatus.BAD_REQUEST, "Нельзя оставить отзыв самому себе"),
    SELF_CONVERSATION(HttpStatus.BAD_REQUEST, "Нельзя написать самому себе"),
    AD_NOT_ACTIVE(HttpStatus.BAD_REQUEST, "Объявление не активно"),
    UNSUPPORTED_PROMO(HttpStatus.BAD_REQUEST, "Неподдерживаемая промо-услуга"),
    FILE_TOO_LARGE(HttpStatus.BAD_REQUEST, "Файл слишком большой"),
    INVALID_IMAGE(HttpStatus.BAD_REQUEST, "Некорректное изображение"),
    UNSUPPORTED_IMAGE_FORMAT(HttpStatus.BAD_REQUEST, "Неподдерживаемый формат изображения"),
    IMAGE_STORAGE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Ошибка сохранения файла"),
    MYID_NOT_CONFIGURED(HttpStatus.BAD_REQUEST, "Проверка MyID не настроена. Укажите MYID_CLIENT_ID и MYID_CLIENT_SECRET."),
    MYID_FAILED(HttpStatus.BAD_REQUEST, "Не удалось пройти проверку MyID"),
    VERIFICATION_FAILED(HttpStatus.BAD_REQUEST, "Не удалось подтвердить личность"),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Внутренняя ошибка сервера");

    private final HttpStatus httpStatus;
    private final String defaultMessage;

    ErrorCode(HttpStatus httpStatus, String defaultMessage) {
        this.httpStatus = httpStatus;
        this.defaultMessage = defaultMessage;
    }
}

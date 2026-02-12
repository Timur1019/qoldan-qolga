package com.test.qoldanqolga.service;

import com.test.qoldanqolga.dto.ad.AdListItemDto;
import com.test.qoldanqolga.model.Advertisement;

import java.util.List;

/**
 * Сервис формирования списка объявлений с обогащением (картинки, избранное, пользователь, рейтинги).
 */
public interface AdListQueryService {

    /**
     * Преобразует список объявлений в AdListItemDto с полным обогащением.
     *
     * @param ads              объявления
     * @param currentUserId    текущий пользователь (для избранного), может быть null
     * @param withUserRatings  загружать ли пользователей и рейтинги
     */
    List<AdListItemDto> buildListItems(List<Advertisement> ads, String currentUserId, boolean withUserRatings);
}

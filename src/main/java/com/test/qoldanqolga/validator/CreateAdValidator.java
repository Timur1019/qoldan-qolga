package com.test.qoldanqolga.validator;

import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Валидатор CreateAdRequest для бизнес-правил сверх Jakarta Validation.
 */
@Component
public class CreateAdValidator implements Validator<CreateAdRequest> {

    @Override
    public List<String> validate(CreateAdRequest req) {
        List<String> errors = new ArrayList<>();
        if (req == null) {
            errors.add("Запрос пуст");
            return errors;
        }
        if (req.getPrice() != null && req.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            errors.add("Цена не может быть отрицательной");
        }
        if (Boolean.TRUE.equals(req.getGiveAway()) && req.getPrice() != null && req.getPrice().compareTo(BigDecimal.ZERO) != 0) {
            errors.add("При отдаче даром цена должна быть 0");
        }
        return errors;
    }
}

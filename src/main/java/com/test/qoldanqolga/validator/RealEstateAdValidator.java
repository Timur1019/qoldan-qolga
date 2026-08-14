package com.test.qoldanqolga.validator;

import com.test.qoldanqolga.constant.RealEstateCategoryCodes;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.service.component.CategoryResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RealEstateAdValidator {

    private final CategoryResolver categoryResolver;

    public List<String> validate(CreateAdRequest req) {
        List<String> errors = new ArrayList<>();
        if (req == null || req.getCategory() == null || req.getCategory().isBlank()) {
            return errors;
        }
        String category = req.getCategory();
        if (!inTree(category, RealEstateCategoryCodes.ROOT)) {
            return errors;
        }

        if (!notBlank(req.getDealType())) {
            errors.add("Укажите тип сделки (продажа / аренда)");
        } else if (!RealEstateCategoryCodes.DEAL_TYPES.contains(req.getDealType())) {
            errors.add("Неверный тип сделки");
        }

        boolean apartments = inTree(category, RealEstateCategoryCodes.APARTMENTS);
        boolean houses = inTree(category, RealEstateCategoryCodes.HOUSES);
        boolean plots = inTree(category, RealEstateCategoryCodes.PLOTS);
        boolean commercial = inTree(category, RealEstateCategoryCodes.COMMERCIAL);
        boolean garages = inTree(category, RealEstateCategoryCodes.GARAGES);

        if (apartments || houses) {
            if (req.getRooms() == null) {
                errors.add("Укажите количество комнат");
            } else if (req.getRooms() < 0 || req.getRooms() > 20) {
                errors.add("Количество комнат указано неверно");
            }
        }

        if (!plots && req.getAreaM2() == null) {
            errors.add("Укажите площадь, м²");
        }
        if (req.getAreaM2() != null && req.getAreaM2().compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Площадь указана неверно");
        }

        if ((plots || houses) && req.getLandAreaM2() == null) {
            errors.add("Укажите площадь участка, м²");
        }
        if (req.getLandAreaM2() != null && req.getLandAreaM2().compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Площадь участка указана неверно");
        }

        if ((apartments || commercial) && req.getFloor() == null) {
            errors.add("Укажите этаж");
        }
        if (req.getFloor() != null && req.getFloor() < 0) {
            errors.add("Этаж указан неверно");
        }
        if (req.getFloorsTotal() != null && req.getFloorsTotal() < 1) {
            errors.add("Этажность указана неверно");
        }
        if (req.getFloor() != null && req.getFloorsTotal() != null && req.getFloor() > req.getFloorsTotal()) {
            errors.add("Этаж не может быть выше этажности");
        }

        if (notBlank(req.getBuildingType()) && !RealEstateCategoryCodes.BUILDING_TYPES.contains(req.getBuildingType())) {
            errors.add("Неверный тип дома");
        }
        if (notBlank(req.getRenovation()) && !RealEstateCategoryCodes.RENOVATIONS.contains(req.getRenovation())) {
            errors.add("Неверный тип ремонта");
        }

        if (garages && req.getAreaM2() == null) {
            errors.add("Укажите площадь, м²");
        }

        return errors;
    }

    private boolean inTree(String category, String rootCode) {
        List<String> codes = categoryResolver.resolveCategoryCodes(rootCode);
        return codes != null && codes.contains(category);
    }

    private static boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }
}

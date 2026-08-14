package com.test.qoldanqolga.validator;

import com.test.qoldanqolga.constant.TransportCategoryCodes;
import com.test.qoldanqolga.constant.VehicleSpecGroupCodes;
import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.model.VehicleModel;
import com.test.qoldanqolga.repository.VehicleModelRepository;
import com.test.qoldanqolga.repository.VehicleSpecOptionRepository;
import com.test.qoldanqolga.service.component.CategoryResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class TransportAdValidator {

    private static final int MIN_YEAR = 1950;

    private final CategoryResolver categoryResolver;
    private final VehicleModelRepository vehicleModelRepository;
    private final VehicleSpecOptionRepository vehicleSpecOptionRepository;

    public List<String> validate(CreateAdRequest req) {
        List<String> errors = new ArrayList<>();
        if (req == null || req.getCategory() == null || req.getCategory().isBlank()) {
            return errors;
        }
        String category = req.getCategory();
        if (!inTree(category, TransportCategoryCodes.ROOT)) {
            return errors;
        }

        Integer year = req.getYear();
        if (year != null && (year < MIN_YEAR || year > Year.now().getValue() + 1)) {
            errors.add("Год выпуска указан неверно");
        }
        if (req.getMileage() != null && req.getMileage() < 0) {
            errors.add("Пробег не может быть отрицательным");
        }
        if (req.getEngineVolume() != null && req.getEngineVolume().compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Объём двигателя указан неверно");
        }
        if (invalidEnum(req.getBodyType(), VehicleSpecGroupCodes.BODY_TYPE)) {
            errors.add("Неверный тип кузова");
        }
        if (invalidEnum(req.getTransmission(), VehicleSpecGroupCodes.TRANSMISSION)) {
            errors.add("Неверный тип КПП");
        }
        if (invalidEnum(req.getFuelType(), VehicleSpecGroupCodes.FUEL_TYPE)) {
            errors.add("Неверный тип топлива");
        }
        if (invalidEnum(req.getDriveType(), VehicleSpecGroupCodes.DRIVE_TYPE)) {
            errors.add("Неверный тип привода");
        }
        if (invalidEnum(req.getExteriorColor(), VehicleSpecGroupCodes.EXTERIOR_COLOR)) {
            errors.add("Неверный цвет");
        }
        if (invalidEnum(req.getSteering(), VehicleSpecGroupCodes.STEERING)) {
            errors.add("Неверный тип руля");
        }
        if (req.getSeats() != null) {
            if (req.getSeats() < 1 || req.getSeats() > 50) {
                errors.add("Количество мест указано неверно");
            } else if (!matchesSeatsOrOwners(req.getSeats(), VehicleSpecGroupCodes.SEATS, 8)) {
                errors.add("Количество мест указано неверно");
            }
        }
        if (req.getOwnersCount() != null) {
            if (req.getOwnersCount() < 0 || req.getOwnersCount() > 99) {
                errors.add("Количество владельцев указано неверно");
            } else if (!matchesSeatsOrOwners(req.getOwnersCount(), VehicleSpecGroupCodes.OWNERS_COUNT, 4)) {
                errors.add("Количество владельцев указано неверно");
            }
        }

        if (notBlank(req.getModelId())) {
            VehicleModel model = vehicleModelRepository.findById(req.getModelId()).orElse(null);
            if (model == null || Boolean.FALSE.equals(model.getIsActive())) {
                errors.add("Модель не найдена");
            } else if (notBlank(req.getBrandId()) && !req.getBrandId().equals(model.getBrandId())) {
                errors.add("Модель не относится к выбранной марке");
            }
        }

        if (inTree(category, TransportCategoryCodes.CARS)) {
            if (!notBlank(req.getBrandId())) {
                errors.add("Выберите марку");
            }
            if (!notBlank(req.getModelId()) && !notBlank(req.getModelCustom())) {
                errors.add("Выберите модель или укажите свою");
            }
            if (year == null) {
                errors.add("Укажите год выпуска");
            }
            if (req.getMileage() == null) {
                errors.add("Укажите пробег");
            }
        }
        return errors;
    }

    private boolean invalidEnum(String value, String groupCode) {
        if (!notBlank(value)) return false;
        Set<String> allowed = vehicleSpecOptionRepository.findActiveValueCodesByGroup(groupCode);
        return allowed == null || !allowed.contains(value);
    }

    /** Числовые коды + NPLUS (храним как N). */
    private boolean matchesSeatsOrOwners(int value, String groupCode, int plusThreshold) {
        Set<String> allowed = vehicleSpecOptionRepository.findActiveValueCodesByGroup(groupCode);
        if (allowed == null || allowed.isEmpty()) return true;
        if (allowed.contains(String.valueOf(value))) return true;
        String plusCode = plusThreshold + "PLUS";
        return value >= plusThreshold && allowed.contains(plusCode);
    }

    private boolean inTree(String category, String rootCode) {
        List<String> codes = categoryResolver.resolveCategoryCodes(rootCode);
        return codes != null && codes.contains(category);
    }

    private static boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }
}

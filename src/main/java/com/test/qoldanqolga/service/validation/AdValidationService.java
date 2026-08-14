package com.test.qoldanqolga.service.validation;

import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.exception.ValidationException;
import com.test.qoldanqolga.util.LogUtil;
import com.test.qoldanqolga.validator.CreateAdValidator;
import com.test.qoldanqolga.validator.RealEstateAdValidator;
import com.test.qoldanqolga.validator.TransportAdValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AdValidationService {

    private final CreateAdValidator createAdValidator;
    private final TransportAdValidator transportAdValidator;
    private final RealEstateAdValidator realEstateAdValidator;

    public void validateCreateOrUpdate(CreateAdRequest request) {
        List<String> errors = new ArrayList<>(createAdValidator.validate(request));
        errors.addAll(transportAdValidator.validate(request));
        errors.addAll(realEstateAdValidator.validate(request));
        if (!errors.isEmpty()) {
            LogUtil.debug(AdValidationService.class, "Validation failed: {} errors", errors.size());
            throw new ValidationException(errors);
        }
    }
}

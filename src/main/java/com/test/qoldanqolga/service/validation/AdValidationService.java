package com.test.qoldanqolga.service.validation;

import com.test.qoldanqolga.dto.ad.CreateAdRequest;
import com.test.qoldanqolga.exception.ValidationException;
import com.test.qoldanqolga.validator.CreateAdValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AdValidationService {

    private final CreateAdValidator createAdValidator;

    public void validateCreateOrUpdate(CreateAdRequest request) {
        List<String> errors = createAdValidator.validate(request);
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
    }
}

package com.test.qoldanqolga.dto.ad;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportAdRequest {
    @NotBlank(message = "Reason is required")
    private String reason;

    private String comment;
}

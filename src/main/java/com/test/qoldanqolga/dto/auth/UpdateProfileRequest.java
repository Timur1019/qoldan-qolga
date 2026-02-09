package com.test.qoldanqolga.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank(message = "Имя не может быть пустым")
    @Size(min = 1, max = 100)
    private String displayName;

    @Email(message = "Некорректный email")
    @NotBlank(message = "Email не может быть пустым")
    @Size(max = 255)
    private String email;

    @Size(max = 50)
    private String avatar;
}

package com.test.qoldanqolga.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Email обязателен")
    @Email
    private String email;

    @NotBlank(message = "Пароль обязателен")
    @Size(min = 6, message = "Пароль не менее 6 символов")
    private String password;

    @NotBlank(message = "Имя обязательно")
    @Size(max = 100)
    private String displayName;
}

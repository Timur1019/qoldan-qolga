package com.test.qoldanqolga.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotBlank(message = "Текст сообщения не может быть пустым")
    @Size(max = 2000)
    private String text;
}

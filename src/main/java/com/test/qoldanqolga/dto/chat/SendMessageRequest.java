package com.test.qoldanqolga.dto.chat;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SendMessageRequest {

    @Size(max = 2000)
    private String text;

    @Size(max = 512)
    private String attachmentUrl;

    @Size(max = 20)
    private String messageType;

    @AssertTrue(message = "Текст или вложение обязательны")
    public boolean isTextOrAttachmentPresent() {
        boolean hasText = text != null && !text.isBlank();
        boolean hasAttachment = attachmentUrl != null && !attachmentUrl.isBlank();
        return hasText || hasAttachment;
    }
}

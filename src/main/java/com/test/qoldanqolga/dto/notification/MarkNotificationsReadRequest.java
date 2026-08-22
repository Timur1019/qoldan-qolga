package com.test.qoldanqolga.dto.notification;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MarkNotificationsReadRequest {

    private List<String> ids;
}

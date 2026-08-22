package com.test.qoldanqolga.service.notification;

public interface LoginDeviceTracker {

    /**
     * Records device and returns true if this is a new device for the user.
     */
    boolean registerAndIsNew(String userId, String deviceId, String platform);
}

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { configureNotificationHandler } from '@/notifications/configureNotificationHandler';
import { hasOsNotificationPermission } from '@/notifications/notificationConsent';
import { loadNotificationPrefs } from '@/notifications/notificationPrefs';
import { openFromNotification } from '@/notifications/openFromNotification';
import { syncExpoPushToken } from '@/notifications/syncExpoPushToken';

configureNotificationHandler();

export function usePushNotifications() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const tap = Notifications.addNotificationResponseReceivedListener(openFromNotification);
    return () => {
      tap.remove();
    };
  }, []);

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    void (async () => {
      if (!(await hasOsNotificationPermission())) return;
      await loadNotificationPrefs().catch(() => {});
      await syncExpoPushToken().catch(() => {});
    })();
  }, [loading, isAuthenticated]);
}

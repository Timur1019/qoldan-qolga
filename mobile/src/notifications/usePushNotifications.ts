import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { savePushInboxItem } from '@/notifications/inboxStorage';
import { mapNotificationToInbox } from '@/notifications/mapNotificationToInbox';
import { openFromNotification } from '@/notifications/openFromNotification';
import { showWelcomeNotification } from '@/notifications/showWelcomeNotification';
import {
  requestNotificationPermission,
  syncExpoPushToken,
} from '@/notifications/syncExpoPushToken';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const tap = Notifications.addNotificationResponseReceivedListener(openFromNotification);
    const received = Notifications.addNotificationReceivedListener((notification) => {
      void savePushInboxItem(mapNotificationToInbox(notification));
    });
    return () => {
      tap.remove();
      received.remove();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const granted = await requestNotificationPermission();
      if (cancelled || !granted) return;
      await showWelcomeNotification(t('notify.welcomeTitle'), t('notify.welcomeBody'));
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    void syncExpoPushToken().catch(() => {});
  }, [loading, isAuthenticated]);
}

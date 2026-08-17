import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
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
    const sub = Notifications.addNotificationResponseReceivedListener(openFromNotification);
    return () => sub.remove();
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

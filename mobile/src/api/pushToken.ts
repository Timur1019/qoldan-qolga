import { apiRequest } from '@/api/client';
import {
  getCachedNotificationPrefs,
  loadNotificationPrefs,
} from '@/notifications/notificationPrefs';
import { mapNotificationPrefsToPushToken } from '@/utils/mapNotificationPrefsToPushToken';

export async function registerPushTokenOnServer(token: string, platform: string) {
  let prefs = getCachedNotificationPrefs();
  try {
    prefs = await loadNotificationPrefs();
  } catch {
    /* use cache / defaults */
  }
  const channels = mapNotificationPrefsToPushToken(prefs);
  await apiRequest('/push/token', {
    method: 'POST',
    body: JSON.stringify({
      token,
      platform,
      ...channels,
    }),
  });
}

export async function unregisterPushTokenOnServer(token: string) {
  await apiRequest(`/push/token?token=${encodeURIComponent(token)}`, {
    method: 'DELETE',
  });
}

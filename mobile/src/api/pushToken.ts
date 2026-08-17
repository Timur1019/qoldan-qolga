import { apiRequest } from '@/api/client';
import { getNotificationPrefs } from '@/notifications/notificationPrefs';

export async function registerPushTokenOnServer(token: string, platform: string) {
  const prefs = await getNotificationPrefs();
  await apiRequest('/push/token', {
    method: 'POST',
    body: JSON.stringify({
      token,
      platform,
      chatEnabled: prefs.chat,
      systemEnabled: prefs.system,
      promoEnabled: prefs.promo,
    }),
  });
}

export async function unregisterPushTokenOnServer(token: string) {
  await apiRequest(`/push/token?token=${encodeURIComponent(token)}`, {
    method: 'DELETE',
  });
}

import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

const WELCOME_KEY = 'notif_welcome_shown';

export async function showWelcomeNotification(title: string, body: string) {
  try {
    const shown = await SecureStore.getItemAsync(WELCOME_KEY);
    if (shown === '1') return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'WELCOME' },
        sound: 'default',
      },
      trigger: null,
    });
    await SecureStore.setItemAsync(WELCOME_KEY, '1');
  } catch {
    // ignore
  }
}

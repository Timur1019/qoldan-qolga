import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { registerPushTokenOnServer, unregisterPushTokenOnServer } from '@/api/pushToken';

const TOKEN_KEY = 'expo_push_token';

export async function ensureAndroidChannels() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('chat', {
    name: 'Xabarlar',
    description: 'Chat xabarlari — ovoz va tebranish bilan',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    enableVibrate: true,
    vibrationPattern: [0, 250, 250, 250],
    showBadge: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
  await Notifications.setNotificationChannelAsync('system', {
    name: 'Tizim',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    enableVibrate: true,
  });
  await Notifications.setNotificationChannelAsync('promo', {
    name: 'Aksiyalar',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted || asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function syncExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }
  const granted = await requestNotificationPermission();
  if (!granted) {
    return null;
  }
    await ensureAndroidChannels();
    try {
      const projectId =
        Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId ?? undefined;
      const tokenResponse = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      const token = tokenResponse.data;
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await registerPushTokenOnServer(token, Platform.OS);
      return token;
    } catch {
      return null;
    }
}

export async function unregisterStoredPushToken() {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      await unregisterPushTokenOnServer(token);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch {
    // сеть / уже вышли
  }
}

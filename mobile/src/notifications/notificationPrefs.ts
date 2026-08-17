import * as SecureStore from 'expo-secure-store';

export type NotificationPrefKey = 'chat' | 'system' | 'promo';

const KEYS: Record<NotificationPrefKey, string> = {
  chat: 'notif_chat',
  system: 'notif_system',
  promo: 'notif_promo',
};

const LEGACY_IMPORTANT = 'notif_important';

async function readBool(key: string, fallback = true): Promise<boolean> {
  try {
    const v = await SecureStore.getItemAsync(key);
    if (v == null) return fallback;
    return v === '1';
  } catch {
    return fallback;
  }
}

export async function getNotificationPrefs() {
  const legacyImportant = await readBool(LEGACY_IMPORTANT, true);
  const chat = await readBool(KEYS.chat, legacyImportant);
  const system = await readBool(KEYS.system, legacyImportant);
  const promo = await readBool(KEYS.promo, true);
  return { chat, system, promo };
}

export async function setNotificationPref(key: NotificationPrefKey, value: boolean) {
  try {
    await SecureStore.setItemAsync(KEYS[key], value ? '1' : '0');
  } catch {
    // ignore
  }
}

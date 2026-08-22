import * as SecureStore from 'expo-secure-store';

import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreference,
} from '@/api/notifications';

const CACHE_KEY = 'notif_prefs_cache_v2';

export const DEFAULT_NOTIFICATION_PREFS: NotificationPreference = {
  pushEnabled: true,
  chatEnabled: true,
  favoriteEnabled: true,
  adEnabled: true,
  promotionEnabled: true,
  paymentEnabled: true,
  profileEnabled: true,
  dealEnabled: true,
  regionalEnabled: true,
  marketingEnabled: false,
  quietHoursEnabled: false,
};

let memoryCache: NotificationPreference | null = null;

async function readDiskCache(): Promise<NotificationPreference | null> {
  try {
    const raw = await SecureStore.getItemAsync(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as NotificationPreference;
  } catch {
    return null;
  }
}

async function writeDiskCache(prefs: NotificationPreference) {
  try {
    await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function getCachedNotificationPrefs(): NotificationPreference {
  return memoryCache ?? DEFAULT_NOTIFICATION_PREFS;
}

export async function loadNotificationPrefs(): Promise<NotificationPreference> {
  try {
    const prefs = await fetchNotificationPreferences();
    memoryCache = prefs;
    await writeDiskCache(prefs);
    return prefs;
  } catch {
    if (memoryCache) return memoryCache;
    const disk = await readDiskCache();
    if (disk) {
      memoryCache = disk;
      return disk;
    }
    return DEFAULT_NOTIFICATION_PREFS;
  }
}

export async function saveNotificationPrefs(
  partial: Partial<NotificationPreference>
): Promise<NotificationPreference> {
  const current = await loadNotificationPrefs();
  const merged = { ...current, ...partial };
  try {
    const saved = await updateNotificationPreferences(partial);
    memoryCache = saved;
    await writeDiskCache(saved);
    return saved;
  } catch {
    memoryCache = merged;
    await writeDiskCache(merged);
    return merged;
  }
}

export function clearNotificationPrefsCache() {
  memoryCache = null;
}

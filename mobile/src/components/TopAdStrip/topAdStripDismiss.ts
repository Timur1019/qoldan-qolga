import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'site-top-banner-dismissed-until';
const LEGACY_KEY = 'site-top-banner-dismissed';
export const TOP_AD_DISMISS_MS = 2 * 60 * 60 * 1000;

type DismissRow = { id: string; until: number };

const webStorage = {
  getItem(key: string): string | null {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  removeItem(key: string) {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

async function getItem(key: string): Promise<string> {
  if (Platform.OS === 'web') return webStorage.getItem(key) || '';
  return (await SecureStore.getItemAsync(key)) || '';
}

async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    webStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string) {
  if (Platform.OS === 'web') {
    webStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function isBannerDismissed(id: string): Promise<boolean> {
  if (!id) return false;
  try {
    const raw = await getItem(STORAGE_KEY);
    if (!raw) return false;
    const row = JSON.parse(raw) as DismissRow;
    if (!row?.id || String(row.id) !== String(id)) return false;
    if (Number(row.until) > Date.now()) return true;
    await removeItem(STORAGE_KEY);
    return false;
  } catch {
    return false;
  }
}

export async function dismissBannerForAWhile(id: string): Promise<void> {
  if (!id) return;
  try {
    await setItem(
      STORAGE_KEY,
      JSON.stringify({ id: String(id), until: Date.now() + TOP_AD_DISMISS_MS })
    );
    await removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
}

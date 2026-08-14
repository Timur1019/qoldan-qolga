import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'site-top-banner-dismissed';

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

export async function getDismissedBannerId(): Promise<string> {
  try {
    if (Platform.OS === 'web') return webStorage.getItem(STORAGE_KEY) || '';
    return (await SecureStore.getItemAsync(STORAGE_KEY)) || '';
  } catch {
    return '';
  }
}

export async function setDismissedBannerId(id: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (id) webStorage.setItem(STORAGE_KEY, String(id));
      else webStorage.removeItem(STORAGE_KEY);
      return;
    }
    if (id) await SecureStore.setItemAsync(STORAGE_KEY, String(id));
    else await SecureStore.deleteItemAsync(STORAGE_KEY);
  } catch {
    // ignore
  }
}

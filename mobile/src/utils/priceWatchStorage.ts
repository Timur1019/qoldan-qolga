import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const PREFIX = 'ad-price-watch:';

type WatchRow = {
  price: number;
  currency: string;
  title: string;
  savedAt: number;
};

async function getRaw(userId: string): Promise<string> {
  const key = `${PREFIX}${userId}`;
  if (Platform.OS === 'web') {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) || '' : '';
    } catch {
      return '';
    }
  }
  return (await SecureStore.getItemAsync(key)) || '';
}

async function setRaw(userId: string, value: string) {
  const key = `${PREFIX}${userId}`;
  if (Platform.OS === 'web') {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function readAll(userId: string): Promise<Record<string, WatchRow>> {
  try {
    const raw = await getRaw(userId);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, WatchRow>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function writeAll(userId: string, map: Record<string, WatchRow>) {
  await setRaw(userId, JSON.stringify(map));
}

export async function isPriceWatched(userId: string | undefined, adId: string | undefined) {
  if (!userId || !adId) return false;
  const map = await readAll(userId);
  return Boolean(map[adId]);
}

export async function setPriceWatch(
  userId: string,
  ad: { id: string; price?: number; currency?: string; title?: string }
) {
  const map = await readAll(userId);
  map[ad.id] = {
    price: Number(ad.price),
    currency: ad.currency || 'UZS',
    title: ad.title || '',
    savedAt: Date.now(),
  };
  await writeAll(userId, map);
}

export async function clearPriceWatch(userId: string, adId: string) {
  const map = await readAll(userId);
  delete map[adId];
  await writeAll(userId, map);
}

export async function syncPriceWatch(
  userId: string,
  ad: { id: string; price?: number; currency?: string; title?: string }
) {
  const map = await readAll(userId);
  const prev = map[ad.id];
  if (!prev) return null;
  const nextPrice = Number(ad.price);
  const prevPrice = Number(prev.price);
  const changed = Number.isFinite(nextPrice) && Number.isFinite(prevPrice) && nextPrice !== prevPrice;
  map[ad.id] = {
    ...prev,
    price: nextPrice,
    currency: ad.currency || prev.currency || 'UZS',
    title: ad.title || prev.title,
  };
  await writeAll(userId, map);
  if (!changed) return null;
  return {
    dropped: nextPrice < prevPrice,
    prevPrice,
    nextPrice,
    currency: ad.currency || prev.currency || 'UZS',
  };
}

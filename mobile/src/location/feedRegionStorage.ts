import * as SecureStore from 'expo-secure-store';

const KEY = 'feed_region_code';
export const FEED_REGION_ALL = '__all__';

export async function readFeedRegion(): Promise<string | null> {
  try {
    const raw = (await SecureStore.getItemAsync(KEY))?.trim();
    return raw || null;
  } catch {
    return null;
  }
}

export async function writeFeedRegion(code: string) {
  try {
    await SecureStore.setItemAsync(KEY, code);
  } catch {
    /* ignore */
  }
}

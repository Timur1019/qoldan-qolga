import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

const CONSENT_KEY = 'push_consent_status';
const LATER_AT_KEY = 'push_consent_later_at';

export type PushConsentStatus = 'granted' | 'denied' | 'later' | null;

const LATER_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export async function getConsentStatus(): Promise<PushConsentStatus> {
  try {
    const v = await SecureStore.getItemAsync(CONSENT_KEY);
    if (v === 'granted' || v === 'denied' || v === 'later') return v;
    return null;
  } catch {
    return null;
  }
}

export async function setConsentStatus(status: Exclude<PushConsentStatus, null>) {
  await SecureStore.setItemAsync(CONSENT_KEY, status);
  if (status === 'later') {
    await SecureStore.setItemAsync(LATER_AT_KEY, String(Date.now()));
  }
}

export async function hasOsNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  return (
    current.granted ||
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function shouldShowConsentPrompt(): Promise<boolean> {
  if (await hasOsNotificationPermission()) return false;
  const status = await getConsentStatus();
  if (status === 'denied') return false;
  if (status === 'later') {
    try {
      const raw = await SecureStore.getItemAsync(LATER_AT_KEY);
      const at = raw ? Number(raw) : 0;
      if (at && Date.now() - at < LATER_COOLDOWN_MS) return false;
    } catch {
      // ignore
    }
  }
  return true;
}

import * as SecureStore from 'expo-secure-store';

import { BUSINESS_PENDING_KEY } from '@/constants/businessSignup';

export async function markBusinessApplicationPending() {
  await SecureStore.setItemAsync(BUSINESS_PENDING_KEY, new Date().toISOString());
}

export async function clearBusinessApplicationPending() {
  await SecureStore.deleteItemAsync(BUSINESS_PENDING_KEY);
}

export async function getBusinessApplicationPending(): Promise<string | null> {
  return SecureStore.getItemAsync(BUSINESS_PENDING_KEY);
}

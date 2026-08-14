import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';

import { getStoredToken } from '@/api/tokenStorage';

export type BusinessApplicationPayload = {
  fullName: string;
  shopName: string;
  businessType: string;
  city: string;
  productCategory: string;
  shopUrl?: string;
  phone: string;
  agreement: boolean;
  passportUri: string;
  registrationUri: string;
};

/** Multipart заявка на статус магазина (как на вебе). */
export async function submitBusinessApplication(
  apiBase: string,
  payload: BusinessApplicationPayload
): Promise<unknown> {
  const token = await getStoredToken();
  const passport = new File(payload.passportUri);
  const registration = new File(payload.registrationUri);
  if (!passport.exists) throw new Error('Pasport fayli topilmadi');
  if (!registration.exists) throw new Error('Ro‘yxatdan o‘tish hujjati topilmadi');

  const formData = new FormData();
  formData.append('fullName', payload.fullName.trim());
  formData.append('shopName', payload.shopName.trim());
  formData.append('businessType', payload.businessType);
  formData.append('city', payload.city.trim());
  formData.append('productCategory', payload.productCategory);
  if (payload.shopUrl?.trim()) formData.append('shopUrl', payload.shopUrl.trim());
  formData.append('phone', payload.phone.trim());
  formData.append('agreement', payload.agreement ? 'true' : 'false');
  formData.append('passport', passport);
  formData.append('registration', registration);

  const res = await expoFetch(`${apiBase}/business-applications`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) throw new Error(data.message || res.statusText || 'Ariza yuborilmadi');
  return data;
}

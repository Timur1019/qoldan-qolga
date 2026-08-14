import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';

import { getStoredToken } from '@/api/tokenStorage';

/**
 * Expo SDK 57+: нельзя класть `{ uri, name, type }` в FormData —
 * будет `Unsupported FormDataPart implementation`.
 * Нужен `File` из expo-file-system + `expo/fetch`.
 */
export async function uploadAdImage(apiBase: string, localUri: string): Promise<string> {
  const token = await getStoredToken();
  const file = new File(localUri);
  if (!file.exists) {
    throw new Error('Rasm topilmadi. Qayta tanlang.');
  }

  const formData = new FormData();
  // Expo File реализует Blob-интерфейс для multipart
  formData.append('file', file);

  const res = await expoFetch(`${apiBase}/ads/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
  if (!res.ok) throw new Error(data.message || res.statusText || 'Upload xatosi');
  if (!data.url) throw new Error('Upload javobi boʻsh');
  return data.url;
}

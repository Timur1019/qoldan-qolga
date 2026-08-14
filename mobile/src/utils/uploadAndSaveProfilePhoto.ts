import { adsApi, authApi } from '@/api/client';
import { isPhotoAvatar } from '@/utils/isPhotoAvatar';

interface Params {
  displayName: string;
  email: string;
  localUri: string;
  currentAvatar?: string | null;
  currentPhotos?: string[] | null;
}

/** Rasmni yuklab, profilga avatar sifatida yozadi. */
export async function uploadAndSaveProfilePhoto({
  displayName,
  email,
  localUri,
  currentAvatar,
  currentPhotos,
}: Params): Promise<string> {
  const url = await adsApi.upload(localUri);
  const existing = Array.isArray(currentPhotos)
    ? currentPhotos.filter(isPhotoAvatar)
    : [];
  if (isPhotoAvatar(currentAvatar) && currentAvatar && !existing.includes(currentAvatar)) {
    existing.unshift(currentAvatar);
  }
  const avatarPhotos = [url, ...existing.filter((u) => u !== url)].slice(0, 10);

  await authApi.updateProfile({
    displayName: displayName.trim(),
    email: email.trim(),
    avatar: url,
    avatarPhotos,
  });

  return url;
}

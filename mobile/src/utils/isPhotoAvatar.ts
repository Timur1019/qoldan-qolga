/** Аватар-фото (URL), а не emoji-ключ вроде star/cat. */
export function isPhotoAvatar(avatar?: string | null) {
  if (!avatar || typeof avatar !== 'string') return false;
  return (
    avatar.startsWith('/') ||
    avatar.startsWith('http') ||
    avatar.startsWith('uploads/')
  );
}

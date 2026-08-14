import { useCallback } from 'react';

import { adsApi, isAuthError } from '@/api/client';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import type { AdListItemDto } from '@/types/api';

/** Избранное: гость → AuthRequiredSheet; авторизован → toggle. */
export function useFavoriteClick(onUpdate: (adId: string, favorite: boolean) => void) {
  const requireAuth = useRequireAuth();

  return useCallback(
    (ad: AdListItemDto) => {
      if (!requireAuth()) return;
      adsApi
        .toggleFavorite(ad.id)
        .then((nowFavorite) => onUpdate(ad.id, nowFavorite))
        .catch((err) => {
          if (isAuthError(err)) requireAuth();
        });
    },
    [onUpdate, requireAuth]
  );
}

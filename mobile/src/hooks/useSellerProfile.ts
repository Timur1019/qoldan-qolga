import { useCallback, useEffect, useState } from 'react';

import { usersApi } from '@/api/client';
import type { AdListItemDto, PageResponse } from '@/types/api';

export function useSellerProfile(userId?: string) {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [ads, setAds] = useState<AdListItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      usersApi.getProfile(userId).catch(() => null),
      usersApi.getAds(userId, { size: 40 }).catch(() => ({ content: [] })),
    ])
      .then(([p, adsPage]) => {
        setProfile((p as Record<string, unknown>) || null);
        const page = adsPage as PageResponse<AdListItemDto>;
        setAds(Array.isArray(page?.content) ? page.content : []);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFavorite = useCallback((adId: string, favorite: boolean) => {
    setAds((prev) => prev.map((a) => (a.id === adId ? { ...a, favorite } : a)));
  }, []);

  return { profile, setProfile, ads, loading, updateFavorite, reload: load };
}

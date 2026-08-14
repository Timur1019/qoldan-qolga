import { useEffect, useState } from 'react';

import { adsApi, usersApi } from '@/api/client';
import type { AdDetailDto, AdListItemDto, PageResponse } from '@/types/api';
import { mergeAdsLists } from '@/utils/mergeAdsLists';

const RELATED_LIMIT = 10;

export interface SellerProfileLite {
  id?: string;
  displayName?: string;
  avatarUrl?: string | null;
  isStore?: boolean;
  [key: string]: unknown;
}

export function useAdDetail(id?: string) {
  const [ad, setAd] = useState<AdDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerAds, setSellerAds] = useState<AdListItemDto[]>([]);
  const [similar, setSimilar] = useState<AdListItemDto[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfileLite | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adsApi
      .getById(id)
      .then((data) => setAd(data as AdDetailDto))
      .catch(() => setAd(null))
      .finally(() => setLoading(false));
    adsApi.recordView(id).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!ad?.id) return;

    const sellerAdsPromise = ad.userId
      ? usersApi
          .getAds(ad.userId, { size: 20 })
          .then((data) => {
            const page = data as PageResponse<AdListItemDto>;
            return mergeAdsLists(page.content || [], [], { excludeIds: [ad.id], limit: RELATED_LIMIT });
          })
          .catch(() => [] as AdListItemDto[])
      : Promise.resolve([] as AdListItemDto[]);

    const similarPromise = ad.category
      ? adsApi
          .list({ category: ad.category, size: 40, sort: 'createdAt,desc' })
          .then((data) => {
            const page = data as PageResponse<AdListItemDto>;
            return mergeAdsLists(page.content || [], [], {
              excludeIds: [ad.id],
              limit: RELATED_LIMIT,
            });
          })
          .catch(() => [] as AdListItemDto[])
      : Promise.resolve([] as AdListItemDto[]);

    const profilePromise = ad.userId
      ? usersApi.getProfile(ad.userId).catch(() => null)
      : Promise.resolve(null);

    Promise.all([sellerAdsPromise, similarPromise, profilePromise])
      .then(([sellerList, similarList, profile]) => {
        setSellerAds(sellerList);
        setSimilar(similarList);
        setSellerProfile((profile as SellerProfileLite) || null);
      })
      .catch(() => {});
  }, [ad?.id, ad?.userId, ad?.category]);

  return { ad, setAd, loading, sellerAds, similar, sellerProfile, setSellerProfile };
}

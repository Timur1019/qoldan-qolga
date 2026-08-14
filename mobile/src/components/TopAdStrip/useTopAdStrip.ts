import { useCallback, useEffect, useState } from 'react';

import { referenceApi } from '@/api/client';
import { useAuth } from '@/context/AuthContext';
import { dismissBannerForAWhile, isBannerDismissed } from './topAdStripDismiss';

export type SiteTopBanner = {
  id: string;
  title: string;
  linkText?: string | null;
  linkUrl?: string | null;
  iconUrl?: string | null;
  enabled?: boolean;
  sortOrder?: number;
};

async function pickBanner(list: unknown): Promise<SiteTopBanner | null> {
  const items = Array.isArray(list) ? (list as SiteTopBanner[]) : [];
  for (const b of items) {
    if (b?.id && !(await isBannerDismissed(b.id))) return b;
  }
  return null;
}

export function useTopAdStrip() {
  const { isAuthenticated } = useAuth();
  const [banner, setBanner] = useState<SiteTopBanner | null>(null);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await referenceApi.getSiteTopBanners();
      setBanner(await pickBanner(list));
    } catch {
      setBanner(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = setInterval(() => {
      void load();
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated, load]);

  const dismiss = useCallback(() => {
    if (!banner?.id) return;
    void dismissBannerForAWhile(banner.id);
    setBanner(null);
  }, [banner?.id]);

  return { banner, ready, dismiss };
}

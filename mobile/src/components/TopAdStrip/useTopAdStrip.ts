import { useCallback, useEffect, useState } from 'react';

import { referenceApi } from '@/api/client';
import { getDismissedBannerId, setDismissedBannerId } from './topAdStripDismiss';

export type SiteTopBanner = {
  id: string;
  title: string;
  linkText?: string | null;
  linkUrl?: string | null;
  iconUrl?: string | null;
  enabled?: boolean;
  sortOrder?: number;
};

export function useTopAdStrip() {
  const [banner, setBanner] = useState<SiteTopBanner | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await referenceApi.getSiteTopBanners();
        if (cancelled) return;
        const items = Array.isArray(list) ? (list as SiteTopBanner[]) : [];
        const dismissed = await getDismissedBannerId();
        const next = items.find((b) => b?.id && b.id !== dismissed) || null;
        setBanner(next);
      } catch {
        if (!cancelled) setBanner(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = useCallback(() => {
    if (!banner?.id) return;
    void setDismissedBannerId(banner.id);
    setBanner(null);
  }, [banner?.id]);

  return { banner, ready, dismiss };
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { referenceApi } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { localizedName } from '@/utils/localizedName';

export type RegionInfo = {
  code: string;
  nameUz?: string;
  nameRu?: string;
};

type RegionsContextValue = {
  regions: RegionInfo[];
  loading: boolean;
  getRegionLabel: (code?: string | null) => string;
};

const RegionsContext = createContext<RegionsContextValue | null>(null);

export function RegionsProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [regions, setRegions] = useState<RegionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    referenceApi
      .getRegions()
      .then((list) => {
        if (!alive) return;
        setRegions(Array.isArray(list) ? (list as RegionInfo[]) : []);
      })
      .catch(() => {
        if (!alive) return;
        setRegions([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const map = useMemo(() => {
    const m = new Map<string, string>();
    regions.forEach((r) => {
      if (r.code) m.set(String(r.code), localizedName(r, language, r.code));
    });
    return m;
  }, [regions, language]);

  const getRegionLabel = useCallback(
    (code?: string | null) => {
      if (!code) return '';
      return map.get(String(code)) || String(code);
    },
    [map]
  );

  const value = useMemo(
    () => ({ regions, loading, getRegionLabel }),
    [regions, loading, getRegionLabel]
  );

  return <RegionsContext.Provider value={value}>{children}</RegionsContext.Provider>;
}

export function useRegions() {
  const ctx = useContext(RegionsContext);
  if (!ctx) throw new Error('useRegions must be used within RegionsProvider');
  return ctx;
}

/** Безопасно: вне провайдера вернёт код как есть. */
export function useRegionLabel(code?: string | null) {
  const ctx = useContext(RegionsContext);
  if (!code) return '';
  if (!ctx) return String(code);
  return ctx.getRegionLabel(code);
}

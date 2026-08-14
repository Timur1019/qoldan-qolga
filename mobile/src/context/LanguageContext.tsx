import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { createTranslator } from '@/i18n';
import { LANG_STORAGE_KEY, type AppLanguage } from '@/i18n/types';

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  t: (key: string, fallback?: string) => string;
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function normalizeLang(raw: string | null): AppLanguage {
  return raw === 'ru' ? 'ru' : 'uz';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>('uz');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    SecureStore.getItemAsync(LANG_STORAGE_KEY)
      .then((stored) => {
        if (!alive) return;
        setLanguageState(normalizeLang(stored));
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const setLanguage = useCallback(async (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      await SecureStore.setItemAsync(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore persistence errors — UI already switched
    }
  }, []);

  const t = useMemo(() => createTranslator(language), [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, ready }),
    [language, setLanguage, t, ready]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

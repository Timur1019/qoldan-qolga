import { ru } from '@/i18n/ru';
import type { AppLanguage, TranslationDict } from '@/i18n/types';
import { uz } from '@/i18n/uz';

const DICTS: Record<AppLanguage, TranslationDict> = { uz, ru };

export function translate(lang: AppLanguage, key: string, fallback?: string) {
  return DICTS[lang]?.[key] || DICTS.uz[key] || fallback || key;
}

export function createTranslator(lang: AppLanguage) {
  return (key: string, fallback?: string) => translate(lang, key, fallback);
}

import type { AppLanguage } from '@/i18n/types';

export type NamedLocale = {
  nameUz?: string | null;
  nameRu?: string | null;
  code?: string | null;
  id?: string | number | null;
};

/** Как на вебе: ru → nameRu, иначе nameUz (с fallback). */
export function localizedName(
  item: NamedLocale | null | undefined,
  lang: AppLanguage,
  fallback = ''
): string {
  if (!item) return fallback;
  const primary = lang === 'ru' ? item.nameRu : item.nameUz;
  const secondary = lang === 'ru' ? item.nameUz : item.nameRu;
  return (primary || secondary || item.code || (item.id != null ? String(item.id) : '') || fallback).trim();
}

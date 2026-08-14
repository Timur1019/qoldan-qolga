/** Публичный сайт — правовые документы открываем там, без копипаста в приложении. */
export const SITE_ORIGIN = 'https://qoldan-qolga.uz';

export function siteRulesUrl(slug?: string) {
  if (!slug) return `${SITE_ORIGIN}/rules`;
  return `${SITE_ORIGIN}/rules/${encodeURIComponent(slug)}`;
}

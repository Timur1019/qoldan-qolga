import type { AdListItemDto } from '@/types/api';

/** Собирает до `limit` объявлений: сначала primary, затем fallback. Исключает excludeIds. */
export function mergeAdsLists(
  primary: AdListItemDto[] = [],
  fallback: AdListItemDto[] = [],
  { excludeIds = [], limit = 10 }: { excludeIds?: string[]; limit?: number } = {}
): AdListItemDto[] {
  const skip = new Set(excludeIds.map(String).filter(Boolean));
  const out: AdListItemDto[] = [];
  const seen = new Set<string>();

  const push = (list: AdListItemDto[]) => {
    for (const ad of list || []) {
      if (!ad?.id) continue;
      const id = String(ad.id);
      if (skip.has(id) || seen.has(id)) continue;
      seen.add(id);
      out.push(ad);
      if (out.length >= limit) return true;
    }
    return false;
  };

  if (push(primary)) return out;
  push(fallback);
  return out;
}

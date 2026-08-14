/**
 * Собирает до `limit` объявлений: сначала из primary, затем добирает из fallback.
 * Исключает id из excludeIds.
 */
export function mergeAdsLists(primary = [], fallback = [], { excludeIds = [], limit = 10 } = {}) {
  const skip = new Set(excludeIds.map(String).filter(Boolean))
  const out = []
  const seen = new Set()

  const push = (list) => {
    for (const ad of list || []) {
      if (!ad?.id) continue
      const id = String(ad.id)
      if (skip.has(id) || seen.has(id)) continue
      seen.add(id)
      out.push(ad)
      if (out.length >= limit) return true
    }
    return false
  }

  if (push(primary)) return out
  push(fallback)
  return out
}

const STORAGE_KEY = 'site-top-banner-dismissed-until'
const LEGACY_KEY = 'site-top-banner-dismissed'
export const TOP_AD_DISMISS_MS = 2 * 60 * 60 * 1000

function readJson() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function isBannerDismissed(id) {
  if (!id) return false
  const row = readJson()
  if (!row?.id || String(row.id) !== String(id)) {
    try {
      const legacy = localStorage.getItem(LEGACY_KEY)
      if (legacy && String(legacy) === String(id)) {
        localStorage.removeItem(LEGACY_KEY)
      }
    } catch {
      // ignore
    }
    return false
  }
  if (Number(row.until) > Date.now()) return true
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  return false
}

export function dismissBannerForAWhile(id) {
  if (!id) return
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ id: String(id), until: Date.now() + TOP_AD_DISMISS_MS }),
    )
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    // ignore
  }
}

const STORAGE_KEY = 'site-top-banner-dismissed'

export function getDismissedBannerId() {
  try {
    return localStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function setDismissedBannerId(id) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, String(id))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function isExternalHref(href) {
  return /^https?:\/\//i.test(href || '')
}

export function bannerCtaHref(url, fallback) {
  const value = (url || '').trim()
  return value || fallback
}

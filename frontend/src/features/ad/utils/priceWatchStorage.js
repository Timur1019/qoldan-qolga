const PREFIX = 'ad-price-watch:'

function key(userId) {
  return `${PREFIX}${userId || 'guest'}`
}

function readAll(userId) {
  try {
    const raw = localStorage.getItem(key(userId))
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(userId, map) {
  try {
    localStorage.setItem(key(userId), JSON.stringify(map))
  } catch {
    // ignore
  }
}

export function isPriceWatched(userId, adId) {
  if (!userId || !adId) return false
  return Boolean(readAll(userId)[adId])
}

export function setPriceWatch(userId, ad) {
  if (!userId || !ad?.id) return
  const map = readAll(userId)
  map[ad.id] = {
    price: Number(ad.price),
    currency: ad.currency || 'UZS',
    title: ad.title || '',
    savedAt: Date.now(),
  }
  writeAll(userId, map)
}

export function clearPriceWatch(userId, adId) {
  if (!userId || !adId) return
  const map = readAll(userId)
  delete map[adId]
  writeAll(userId, map)
}

export function syncPriceWatch(userId, ad) {
  if (!userId || !ad?.id) return null
  const map = readAll(userId)
  const prev = map[ad.id]
  if (!prev) return null
  const nextPrice = Number(ad.price)
  const prevPrice = Number(prev.price)
  const changed = Number.isFinite(nextPrice) && Number.isFinite(prevPrice) && nextPrice !== prevPrice
  map[ad.id] = {
    ...prev,
    price: nextPrice,
    currency: ad.currency || prev.currency || 'UZS',
    title: ad.title || prev.title,
  }
  writeAll(userId, map)
  if (!changed) return null
  return {
    dropped: nextPrice < prevPrice,
    prevPrice,
    nextPrice,
    currency: ad.currency || prev.currency || 'UZS',
  }
}

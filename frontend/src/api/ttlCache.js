const store = new Map()

export function cachedGet(key, loader, ttlMs = 5 * 60 * 1000) {
  const now = Date.now()
  const hit = store.get(key)
  if (hit?.value !== undefined && hit.expires > now) {
    return Promise.resolve(hit.value)
  }
  if (hit?.inflight) {
    return hit.inflight
  }
  const inflight = Promise.resolve()
    .then(loader)
    .then((value) => {
      store.set(key, { value, expires: Date.now() + ttlMs })
      return value
    })
    .catch((error) => {
      store.delete(key)
      throw error
    })
  store.set(key, { inflight, expires: 0 })
  return inflight
}

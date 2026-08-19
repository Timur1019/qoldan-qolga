import { regionCenter } from './regionCentroids'

function hashId(id) {
  let h = 0
  const s = String(id || '')
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function jitter(lat, lng, id) {
  const h = hashId(id)
  const dLat = ((h % 100) - 50) * 0.004
  const dLng = ((((h / 100) | 0) % 100) - 50) * 0.005
  return [lat + dLat, lng + dLng]
}

function toCoord(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * Координаты пина: точный GPS или центр региона со сдвигом, чтобы точки не слипались.
 */
export function adPinPosition(ad) {
  const lat = toCoord(ad?.locationLat)
  const lng = toCoord(ad?.locationLng)
  if (lat != null && lng != null) return [lat, lng]

  const center = regionCenter(ad?.region)
  if (!center) return null
  return jitter(center[0], center[1], ad?.id)
}

export function adsToMapPins(ads) {
  return (ads || [])
    .map((ad) => {
      const lat = toCoord(ad?.locationLat)
      const lng = toCoord(ad?.locationLng)
      if (lat != null && lng != null) {
        return { id: ad.id, position: [lat, lng], exact: true, ad }
      }
      const center = regionCenter(ad?.region)
      if (!center) return null
      return { id: ad.id, position: jitter(center[0], center[1], ad?.id), exact: false, ad }
    })
    .filter(Boolean)
}

import {
  addressLineFromNominatim,
  matchRegionFromAddress,
  nominatimToParts,
} from '@/utils/matchRegionFromAddress'

function reverseGeocode(lat, lng, lang) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang === 'ru' ? 'ru' : 'uz'}`
  return fetch(url, {
    headers: {
      'Accept-Language': lang === 'ru' ? 'ru' : 'uz',
      'User-Agent': 'QoldanQolga/1.0 (contact@qoldan-qolga.uz)',
    },
  }).then((r) => r.json())
}

export function detectBrowserCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('no-geo'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
    )
  })
}

export async function detectBrowserLocation(regions, lang = 'uz') {
  const coords = await detectBrowserCoords()
  const data = await reverseGeocode(coords.lat, coords.lng, lang).catch(() => null)
  const parts = data ? nominatimToParts(data) : {}
  const match = matchRegionFromAddress(parts, regions)
  return {
    lat: coords.lat.toFixed(6),
    lng: coords.lng.toFixed(6),
    address: addressLineFromNominatim(data) || '',
    regionCode: match?.regionCode || '',
    district: match?.district || '',
  }
}

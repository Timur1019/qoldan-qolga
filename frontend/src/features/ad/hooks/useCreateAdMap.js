import { useCallback, useEffect, useState } from 'react'

/**
 * Map position, geolocation and Nominatim reverse/forward geocode for CreateAd.
 */
export default function useCreateAdMap({ lang, setForm }) {
  const [mapPosition, setMapPosition] = useState(null)

  useEffect(() => {
    if (!mapPosition || !Array.isArray(mapPosition) || mapPosition.length < 2) return
    const [lat, lng] = mapPosition
    if (typeof lat !== 'number' || typeof lng !== 'number') return
    setForm((prev) => ({
      ...prev,
      locationLat: lat.toFixed(5),
      locationLng: lng.toFixed(5),
    }))
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang === 'ru' ? 'ru' : 'en'}`
    fetch(url, {
      headers: {
        'Accept-Language': lang === 'ru' ? 'ru' : 'uz',
        'User-Agent': 'QoldanQolga/1.0 (contact@example.com)',
      },
    })
      .then((r) => r.json())
      .then((data) => {
        const addr = data?.address
        if (!addr) return
        const parts = []
        if (addr.road) parts.push(addr.road)
        if (addr.house_number) parts.push(addr.house_number)
        if (addr.suburb || addr.neighbourhood) parts.push(addr.suburb || addr.neighbourhood)
        if (addr.village || addr.town || addr.city || addr.state) {
          parts.push(addr.village || addr.town || addr.city || addr.state)
        }
        if (parts.length === 0 && data.display_name) parts.push(data.display_name)
        const addressStr = parts.join(', ')
        if (addressStr) setForm((prev) => ({ ...prev, address: addressStr }))
      })
      .catch(() => {})
  }, [mapPosition, lang, setForm])

  const setMyLocation = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setMapPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    )
  }, [])

  const geocodeAddress = useCallback(async (address) => {
    const query = (address || '').trim()
    if (!query) return
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      const res = await fetch(url, {
        headers: {
          'Accept-Language': lang === 'ru' ? 'ru' : 'uz',
          'User-Agent': 'QoldanQolga/1.0 (contact@example.com)',
        },
      })
      const data = await res.json().catch(() => [])
      if (!Array.isArray(data) || data.length === 0) return
      const first = data[0]
      const lat = parseFloat(first.lat)
      const lon = parseFloat(first.lon)
      if (Number.isNaN(lat) || Number.isNaN(lon)) return
      setMapPosition([lat, lon])
      setForm((prev) => ({
        ...prev,
        locationLat: lat.toFixed(5),
        locationLng: lon.toFixed(5),
      }))
    } catch {
      // ignore geocode errors
    }
  }, [lang, setForm])

  return {
    mapPosition,
    setMapPosition,
    setMyLocation,
    geocodeAddress,
  }
}

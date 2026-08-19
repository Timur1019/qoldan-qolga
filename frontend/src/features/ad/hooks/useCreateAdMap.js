import { useCallback, useEffect, useRef, useState } from 'react'
import { detectBrowserLocation } from '@/utils/detectBrowserLocation'
import {
  addressLineFromNominatim,
  matchRegionFromAddress,
  nominatimToParts,
} from '@/utils/matchRegionFromAddress'

/**
 * Map position, geolocation and Nominatim reverse/forward geocode for CreateAd.
 */
export default function useCreateAdMap({ lang, setForm, regions = [], skipAuto = false }) {
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
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang === 'ru' ? 'ru' : 'uz'}`
    fetch(url, {
      headers: {
        'Accept-Language': lang === 'ru' ? 'ru' : 'uz',
        'User-Agent': 'QoldanQolga/1.0 (contact@qoldan-qolga.uz)',
      },
    })
      .then((r) => r.json())
      .then((data) => {
        const parts = nominatimToParts(data)
        const match = matchRegionFromAddress(parts, regions)
        const addressStr = addressLineFromNominatim(data)
        setForm((prev) => ({
          ...prev,
          ...(addressStr ? { address: addressStr } : {}),
          ...(match?.regionCode ? { region: match.regionCode, district: match.district || prev.district } : {}),
        }))
      })
      .catch(() => {})
  }, [mapPosition, lang, setForm, regions])

  const setMyLocation = useCallback(() => {
    detectBrowserLocation(regions, lang)
      .then((loc) => {
        const lat = Number(loc.lat)
        const lng = Number(loc.lng)
        if (Number.isFinite(lat) && Number.isFinite(lng)) setMapPosition([lat, lng])
        setForm((prev) => ({
          ...prev,
          locationLat: loc.lat,
          locationLng: loc.lng,
          address: loc.address || prev.address,
          region: loc.regionCode || prev.region,
          district: loc.district || prev.district,
        }))
      })
      .catch(() => {})
  }, [lang, regions, setForm])

  const autoDone = useRef(false)

  useEffect(() => {
    if (skipAuto || autoDone.current || !regions.length) return
    autoDone.current = true
    setMyLocation()
  }, [skipAuto, regions, setMyLocation])

  const geocodeAddress = useCallback(async (address) => {
    const query = (address || '').trim()
    if (!query) return
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      const res = await fetch(url, {
        headers: {
          'Accept-Language': lang === 'ru' ? 'ru' : 'uz',
          'User-Agent': 'QoldanQolga/1.0 (contact@qoldan-qolga.uz)',
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

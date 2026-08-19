import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export default function AdsListMapFit({ positions, fallbackCenter, fallbackZoom, padding = 48 }) {
  const map = useMap()

  useEffect(() => {
    const apply = () => {
      map.invalidateSize({ animate: false })
      if (!positions.length) {
        if (fallbackCenter) map.setView(fallbackCenter, fallbackZoom ?? 6, { animate: false })
        return
      }
      if (positions.length === 1) {
        map.setView(positions[0], 13, { animate: false })
        return
      }
      map.fitBounds(positions, { padding: [padding, padding], maxZoom: 12, animate: false })
    }
    const timer = setTimeout(apply, 120)
    return () => clearTimeout(timer)
  }, [map, positions, fallbackCenter, fallbackZoom, padding])

  return null
}

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export default function AdsListMapActivePan({ position, exact = false }) {
  const map = useMap()

  useEffect(() => {
    if (!position) return
    const zoom = exact ? Math.max(map.getZoom(), 14) : Math.max(map.getZoom(), 12)
    map.setView(position, zoom, { animate: false })
  }, [map, position, exact])

  return null
}

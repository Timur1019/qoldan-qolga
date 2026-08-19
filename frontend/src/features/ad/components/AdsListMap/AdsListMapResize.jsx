import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export default function AdsListMapResize() {
  const map = useMap()

  useEffect(() => {
    const el = map.getContainer()
    const apply = () => map.invalidateSize({ animate: false })
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [map])

  return null
}

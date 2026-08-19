import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { UZBEKISTAN_CENTER, UZBEKISTAN_ZOOM, regionCenter } from '../../utils/regionCentroids'
import { adsToMapPins } from '../../utils/adMapPins'
import AdsListMapFit from './AdsListMapFit'
import AdsListMapResize from './AdsListMapResize'
import AdsListMapActivePan from './AdsListMapActivePan'
import AdsListMapMarkers from './AdsListMapMarkers'
import styles from './AdsListMap.module.css'

export default function AdsListMap({
  ads,
  activeId,
  regionCode,
  interactive = true,
  onHover,
  onSelect,
  className,
}) {
  const [ready, setReady] = useState(false)
  const pins = useMemo(() => adsToMapPins(ads), [ads])
  const positions = useMemo(() => pins.map((p) => p.position), [pins])
  const fallback = regionCenter(regionCode) || UZBEKISTAN_CENTER
  const activePin = useMemo(
    () => pins.find((p) => p.id === activeId) || null,
    [pins, activeId]
  )

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div className={`${styles.wrap} ${className || ''}`}>
        <div className={styles.placeholder}> </div>
      </div>
    )
  }

  return (
    <div className={`${styles.wrap} ${className || ''}`}>
      <MapContainer
        center={fallback}
        zoom={regionCode ? 10 : UZBEKISTAN_ZOOM}
        className={styles.map}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AdsListMapResize />
        <AdsListMapFit
          positions={positions}
          fallbackCenter={fallback}
          fallbackZoom={regionCode ? 10 : UZBEKISTAN_ZOOM}
          padding={interactive ? 48 : 12}
        />
        {interactive && activePin ? (
          <AdsListMapActivePan position={activePin.position} exact={activePin.exact} />
        ) : null}
        <AdsListMapMarkers
          pins={pins}
          activeId={activeId}
          onHover={interactive ? onHover : undefined}
          onSelect={interactive ? onSelect : undefined}
        />
      </MapContainer>
      {interactive ? (
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.credit}
        >
          © OpenStreetMap
        </a>
      ) : null}
    </div>
  )
}

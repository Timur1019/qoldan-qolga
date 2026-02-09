import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './OSMMap.module.css'

const TASHKENT = [41.2995, 69.2401]

function defaultIcon() {
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

function MapClickHandler({ onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && Array.isArray(center) && center.length >= 2) {
      map.setView(center, zoom ?? map.getZoom())
    }
  }, [center, zoom, map])
  return null
}

export default function OSMMap({ center, position, onPositionChange, className }) {
  const [mapReady, setMapReady] = useState(false)
  const initialCenter = center || TASHKENT
  const pos = position || initialCenter

  useEffect(() => {
    setMapReady(true)
  }, [])

  if (!mapReady) {
    return (
      <div className={`${styles.wrap} ${className || ''}`}>
        <div className={styles.placeholder}>Карта загружается…</div>
      </div>
    )
  }

  return (
    <div className={`${styles.wrap} ${className || ''}`}>
      <MapContainer
        center={position || initialCenter}
        zoom={13}
        className={styles.map}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={pos} icon={defaultIcon()} />
        {onPositionChange && <MapClickHandler onPositionChange={onPositionChange} />}
        {position && <ChangeView center={position} zoom={13} />}
      </MapContainer>
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.attribution}
      >
        © OpenStreetMap
      </a>
    </div>
  )
}

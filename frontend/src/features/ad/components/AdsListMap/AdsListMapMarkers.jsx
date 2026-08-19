import { Marker } from 'react-leaflet'
import { createDotIcon, createPinIcon } from './adsMapIcons'

const DOT = createDotIcon()
const PIN = createPinIcon()

export default function AdsListMapMarkers({ pins, activeId, onHover, onSelect }) {
  return (
    <>
      {pins.map((pin) => {
        if (pin.id === activeId) return null
        return (
          <Marker
            key={pin.id}
            position={pin.position}
            icon={DOT}
            eventHandlers={{
              mouseover: () => onHover?.(pin.id),
              click: () => onSelect?.(pin.id),
            }}
          />
        )
      })}
      {pins.filter((pin) => pin.id === activeId).map((pin) => (
        <Marker
          key={`active-${pin.id}`}
          position={pin.position}
          icon={PIN}
          zIndexOffset={1000}
          eventHandlers={{
            click: () => onSelect?.(pin.id),
          }}
        />
      ))}
    </>
  )
}

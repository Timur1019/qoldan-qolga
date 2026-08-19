import L from 'leaflet'
import styles from './AdsListMap.module.css'

export function createDotIcon() {
  return L.divIcon({
    className: styles.markerRoot,
    html: `<span class="${styles.dot}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export function createPinIcon() {
  return L.divIcon({
    className: styles.markerRoot,
    html: `<span class="${styles.pin}"></span>`,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
  })
}

import { memo } from 'react'
import { useLang } from '../../../../context/LangContext'
import OSMMap from '../../../../components/OSMMap/OSMMap'
import { TASHKENT } from '../../utils/constants'
import styles from './AdLocation.module.css'

function AdLocation({ region, district, address, landmark, canDeliver, lat, lng }) {
  const { t } = useLang()

  const addressText = address || [region, district].filter(Boolean).join(', ')
  const hasLocation = addressText || landmark
  const hasCoords = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng))
  const mapPos = hasCoords ? [Number(lat), Number(lng)] : TASHKENT

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('ads.locationTitle')}</h2>

      {canDeliver === true && (
        <div className={styles.delivery}>
          <i className="bi bi-truck" aria-hidden />
          <span>{t('ads.possibleDelivery')}</span>
        </div>
      )}

      {hasLocation && (
        <div className={styles.placeList}>
          {addressText && (
            <div className={styles.placeRow}>
              <i className={`bi bi-geo-alt ${styles.placeIcon}`} aria-hidden />
              <div>
                <div className={styles.placeMain}>{addressText}</div>
                {district && <div className={styles.placeMeta}>{district}</div>}
              </div>
            </div>
          )}
          {landmark && (
            <div className={styles.placeRow}>
              <i className={`bi bi-building ${styles.placeIcon}`} aria-hidden />
              <div>
                <div className={styles.placeMain}>{landmark}</div>
                <div className={styles.placeMeta}>{t('ads.landmark')}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.mapWrap}>
        <OSMMap center={mapPos} position={mapPos} />
      </div>
    </section>
  )
}

export default memo(AdLocation)

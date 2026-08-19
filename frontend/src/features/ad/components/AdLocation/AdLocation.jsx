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
      <h2 className="h6 mb-2">{t('ads.locationTitle')}</h2>

      {canDeliver === true && (
        <div className="d-flex align-items-center gap-2 text-muted small mb-2">
          <i className="bi bi-truck" aria-hidden />
          <span>{t('ads.possibleDelivery')}</span>
        </div>
      )}

      <div className={styles.mapWrap}>
        <OSMMap center={mapPos} position={mapPos} />
      </div>

      {hasLocation && (
        <div className="mt-2">
          {addressText && (
            <div className="d-flex gap-2 align-items-start mb-2">
              <i className="bi bi-geo-alt text-primary mt-1" aria-hidden />
              <div>
                <div className="small fw-medium">{addressText}</div>
                {district && <div className="small text-muted">{district}</div>}
              </div>
            </div>
          )}
          {landmark && (
            <div className="d-flex gap-2 align-items-start">
              <i className="bi bi-building text-primary mt-1" aria-hidden />
              <div>
                <div className="small fw-medium">{landmark}</div>
                <div className="small text-muted">{t('ads.landmark')}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default memo(AdLocation)

import { memo } from 'react'
import { useLang } from '../../../../context/LangContext'
import OSMMap from '../../../../components/OSMMap/OSMMap'
import { TASHKENT } from '../../utils/constants'
import styles from './AdLocation.module.css'

function LocationIcon() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 21h18" />
      <path d="M9 8h1" />
      <path d="M9 12h1" />
      <path d="M9 16h1" />
      <path d="M14 8h1" />
      <path d="M14 12h1" />
      <path d="M14 16h1" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    </svg>
  )
}

function DeliveryIcon() {
  return (
    <svg className={styles.deliveryIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
      <path d="M15 18h-7" />
      <path d="M2 14h5" />
      <path d="M15 4h4l3 3v6h-7v-6" />
      <path d="M2 8h8v6H2" />
    </svg>
  )
}

function AdLocation({ region, district, address, landmark, canDeliver }) {
  const { t } = useLang()

  const addressText = address || [region, district].filter(Boolean).join(', ')
  const hasLocation = addressText || landmark

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('ads.locationTitle')}</h2>

      {canDeliver === true && (
        <div className={styles.deliveryPanel}>
          <DeliveryIcon />
          <span>{t('ads.possibleDelivery')}</span>
        </div>
      )}

      <div className={styles.mapWrap}>
        <OSMMap center={TASHKENT} position={TASHKENT} />
      </div>

      {hasLocation && (
        <div className={styles.locationDetails}>
          {addressText && (
            <div className={styles.addressRow}>
              <span className={styles.addressIcon} aria-hidden>
                <LocationIcon />
              </span>
              <div>
                <div className={styles.addressText}>{addressText}</div>
                {district && (
                  <div className={styles.addressSecondary}>{district}</div>
                )}
              </div>
            </div>
          )}
          {landmark && (
            <div className={styles.landmarkRow}>
              <span className={styles.landmarkIconWrap} aria-hidden>
                <BuildingIcon />
              </span>
              <div>
                <div className={styles.landmarkText}>{landmark}</div>
                <div className={styles.landmarkLabel}>{t('ads.landmark')}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default memo(AdLocation)

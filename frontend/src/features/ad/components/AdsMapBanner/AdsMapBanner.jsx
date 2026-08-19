import AdsListMap from '../AdsListMap'
import styles from './AdsMapBanner.module.css'

export default function AdsMapBanner({ ads, regionCode, t, onOpen, activeId }) {
  return (
    <div className={styles.banner}>
      <AdsListMap
        ads={ads}
        activeId={activeId}
        regionCode={regionCode}
        interactive={false}
        className={styles.map}
      />
      <button type="button" className={styles.overlay} onClick={onOpen}>
        <span className={styles.cta}>{t('ads.showOnMap')}</span>
      </button>
    </div>
  )
}

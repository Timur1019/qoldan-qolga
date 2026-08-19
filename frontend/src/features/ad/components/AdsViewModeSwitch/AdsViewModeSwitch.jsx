import { ADS_VIEW } from '../../hooks/useAdsListView'
import styles from './AdsViewModeSwitch.module.css'

export default function AdsViewModeSwitch({ view, onChange, t }) {
  const listActive = view === ADS_VIEW.LIST
  const gridActive = view === ADS_VIEW.GRID

  return (
    <div className={styles.switch} role="group" aria-label={t('ads.viewMode')}>
      <button
        type="button"
        className={`${styles.btn} ${listActive ? styles.btnActive : ''}`}
        onClick={() => onChange(ADS_VIEW.LIST)}
        aria-pressed={listActive}
        title={t('ads.viewList')}
        aria-label={t('ads.viewList')}
      >
        <i className="bi bi-list-ul" aria-hidden />
      </button>
      <button
        type="button"
        className={`${styles.btn} ${gridActive ? styles.btnActive : ''}`}
        onClick={() => onChange(ADS_VIEW.GRID)}
        aria-pressed={gridActive}
        title={t('ads.viewGrid')}
        aria-label={t('ads.viewGrid')}
      >
        <i className="bi bi-grid" aria-hidden />
      </button>
    </div>
  )
}

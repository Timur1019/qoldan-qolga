import styles from './AdsShowOnMapButton.module.css'

export default function AdsShowOnMapButton({ onClick, t }) {
  return (
    <button type="button" className={styles.btn} onClick={onClick}>
      <i className="bi bi-geo-alt" aria-hidden />
      {t('ads.showOnMap')}
    </button>
  )
}

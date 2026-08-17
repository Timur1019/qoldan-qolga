import { formatDate } from '../../utils/adFormatters'
import styles from './AdDetailMeta.module.css'

export default function AdDetailMeta({ ad, isOwner, onReport, t }) {
  return (
    <div>
      <div className={styles.adMeta}>
        <div className={styles.adMetaRow}>
          <span className={styles.adMetaLabel}>{t('ads.adId')}</span>
          <span className={styles.adMetaValue} title={ad.id}>
            {ad.id ? String(ad.id).replace(/-/g, '').slice(0, 8).toUpperCase() : '—'}
          </span>
        </div>
        <div className={styles.adMetaRow}>
          <span className={styles.adMetaLabel}>{t('ads.postedAt')}</span>
          <span className={styles.adMetaValue}>{formatDate(ad.createdAt)}</span>
        </div>
      </div>
      <div className="mt-2">
        {!isOwner && (
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={onReport}>
            <i className="bi bi-flag me-1" aria-hidden /> {t('ads.report')}
          </button>
        )}
      </div>
    </div>
  )
}

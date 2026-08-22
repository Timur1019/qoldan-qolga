import { Link } from 'react-router-dom'
import { imageUrl } from '@/api/client'
import { adsPath } from '@/constants/routes'
import { formatPrice } from '@/utils/formatters'
import styles from './ChatAdCard.module.css'

export default function ChatAdCard({ adId, title, imageUrl: img, price, currency, region, compact, t }) {
  if (!adId) return null

  const src = img ? imageUrl(img) : ''

  return (
    <Link
      to={adsPath(adId)}
      className={`${styles.card} ${compact ? styles.cardCompact : ''}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.imageWrap}>
        {src ? (
          <img src={src} alt="" className={styles.image} loading="lazy" />
        ) : (
          <span className={styles.imagePlaceholder} aria-hidden>
            <i className="bi bi-image" />
          </span>
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.title}>{title || '—'}</span>
        <div className={styles.meta}>
          {price != null && (
            <span className={styles.price}>{formatPrice(price, currency)}</span>
          )}
          {region ? (
            <span className={styles.location}>
              <i className="bi bi-geo-alt" aria-hidden /> {region}
            </span>
          ) : null}
        </div>
      </div>
      <span className={styles.action}>
        {!compact && (
          <>
            {t('chat.openAd')} <i className="bi bi-arrow-right" aria-hidden />
          </>
        )}
        {compact && <i className="bi bi-chevron-right" aria-hidden />}
      </span>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { imageUrl } from '@/api/client'
import { useTopAdStrip } from './useTopAdStrip'
import styles from './TopAdStrip.module.css'

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url || '')
}

export default function TopAdStrip() {
  const { banner, ready, dismiss } = useTopAdStrip()

  if (!ready || !banner) return null

  const linkUrl = (banner.linkUrl || '').trim()
  const linkText = (banner.linkText || '').trim() || 'Подробнее'
  const iconSrc = banner.iconUrl ? imageUrl(banner.iconUrl) : null

  const linkEl = linkUrl ? (
    isExternalUrl(linkUrl) ? (
      <a href={linkUrl} className={styles.link} target="_blank" rel="noopener noreferrer">
        {linkText}
      </a>
    ) : (
      <Link to={linkUrl} className={styles.link}>
        {linkText}
      </Link>
    )
  ) : null

  return (
    <div className={styles.strip} role="region" aria-label="Реклама">
      <div className={styles.inner}>
        <div className={styles.content}>
          {iconSrc ? (
            <img src={iconSrc} alt="" className={styles.icon} width={28} height={28} />
          ) : (
            <span className={styles.iconFallback} aria-hidden>
              <i className="bi bi-megaphone" />
            </span>
          )}
          <p className={styles.text}>
            <span className={styles.title}>{banner.title}</span>
            {linkEl}
          </p>
        </div>
        <button type="button" className={styles.close} onClick={dismiss} aria-label="Закрыть">
          <i className="bi bi-x" aria-hidden />
        </button>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { imageUrl } from '../../../api/client'
import { ROUTES } from '../../../constants/routes'
import styles from './HomePromoSection.module.css'

const PER_PAGE = 4

export default function HomePromoSection({ banners = [], t }) {
  const [page, setPage] = useState(0)

  const sorted = useMemo(
    () => [...banners].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [banners],
  )

  if (!sorted.length) return null

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const pageBanners = sorted.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
  const canPrev = page > 0
  const canNext = page < totalPages - 1

  return (
    <section className={styles.section} aria-labelledby="home-promo-heading">
      <div className={styles.head}>
        <div>
          <h2 id="home-promo-heading" className={styles.title}>{t('home.promoUseful')}</h2>
          <p className={styles.lead}>{t('home.promoUsefulLead')}</p>
        </div>
        {totalPages > 1 && (
          <div className={styles.nav} role="group" aria-label={t('home.promoNav')}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={!canPrev}
              aria-label={t('common.prev')}
            >
              <i className="bi bi-chevron-left" aria-hidden />
            </button>
            <span className={styles.page}>{page + 1} / {totalPages}</span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={!canNext}
              aria-label={t('common.next')}
            >
              <i className="bi bi-chevron-right" aria-hidden />
            </button>
          </div>
        )}
      </div>

      <div className={styles.row}>
        {pageBanners.map((banner, i) => {
          const href = (banner.link || '').trim() || ROUTES.HOME
          const isExternal = href.startsWith('http')
          const style = banner.imageUrl
            ? { backgroundImage: `url(${imageUrl(banner.imageUrl)})` }
            : undefined
          const body = (
            <>
              <div className={styles.overlay} aria-hidden />
              {banner.badge && <span className={styles.badge}>{banner.badge}</span>}
              <div className={styles.content}>
                <p className={styles.cardTitle}>{banner.title}</p>
                {banner.subtitle && <p className={styles.cardSubtitle}>{banner.subtitle}</p>}
              </div>
            </>
          )
          const className = `${styles.card} ${banner.imageUrl ? '' : styles.cardFallback}`
          const animStyle = { ...style, animationDelay: `${i * 60}ms` }
          return isExternal ? (
            <a key={banner.id} href={href} className={className} style={animStyle}>
              {body}
            </a>
          ) : (
            <Link key={banner.id} to={href} className={className} style={animStyle}>
              {body}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

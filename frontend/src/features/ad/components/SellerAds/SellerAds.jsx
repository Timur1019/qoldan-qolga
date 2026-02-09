import { useRef, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { imageUrl } from '../../services/adApi'
import { adsPath } from '../../../../constants/routes'
import { formatPrice } from '../../utils/adFormatters'
import styles from './SellerAds.module.css'

const SCROLL_STEP = 260

function SellerAds({ ads = [] }) {
  const { t } = useLang()
  const scrollRef = useRef(null)

  const scroll = useCallback((dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -SCROLL_STEP : SCROLL_STEP, behavior: 'smooth' })
  }, [])

  if (ads.length === 0) return null

  return (
    <div className={styles.wrap}>
      <section className={styles.section}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('ads.sellerAdsTitle')}</h2>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.arrow}
              aria-label={t('ads.prevImage')}
              onClick={() => scroll('left')}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowRight}`}
              aria-label={t('ads.nextImage')}
              onClick={() => scroll('right')}
            >
              ›
            </button>
          </div>
        </div>
        <div className={styles.scrollWrap} ref={scrollRef}>
          <ul className={styles.grid}>
            {ads.map((item) => (
              <li key={item.id}>
                <Link to={adsPath(item.id)} className={styles.card}>
                  {item.mainImageUrl ? (
                    <img src={imageUrl(item.mainImageUrl)} alt="" className={styles.img} />
                  ) : (
                    <div className={styles.imgPlaceholder} />
                  )}
                  <div className={styles.body}>
                    <span className={styles.price}>{formatPrice(item.price, item.currency)}</span>
                    <span className={styles.cardTitle}>{item.title}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default memo(SellerAds)

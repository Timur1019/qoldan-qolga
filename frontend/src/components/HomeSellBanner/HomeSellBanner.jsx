import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import bannerArt from '../../img/baner/baner.png'
import styles from './HomeSellBanner.module.css'

/**
 * CTA «продавайте» — тёмный brand-баннер с коллажем товаров (baner.png).
 */
export default function HomeSellBanner({ t, compact = false }) {
  return (
    <section className={`${styles.banner} ${compact ? styles.compact : ''}`} aria-label={t('ads.sellAndEarn')}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.copy}>
        <p className={styles.kicker}>Qoldan Qolga</p>
        <h2 className={styles.title}>
          <span className={styles.accent}>{t('ads.sellAndEarn')}</span>
        </h2>
        <p className={styles.subtitle}>{t('profile.ctaReviewsHint')}</p>
        <Link to={ROUTES.ADS_CREATE} className={styles.cta}>
          {t('ads.postAd')}
          <i className="bi bi-arrow-up-right" aria-hidden />
        </Link>
      </div>
      <div className={styles.artWrap}>
        <img src={bannerArt} alt="" className={styles.art} />
      </div>
    </section>
  )
}

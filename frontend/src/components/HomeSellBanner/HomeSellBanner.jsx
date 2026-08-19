import { imageUrl } from '@/api/client'
import { ROUTES } from '../../constants/routes'
import bannerArt from '../../img/baner/baner.png'
import useHomeSellBanner from './useHomeSellBanner'
import { bannerCtaHref } from './bannerCtaHref'
import HomeSellBannerCta from './HomeSellBannerCta'
import styles from './HomeSellBanner.module.css'

export default function HomeSellBanner({ t, className = '' }) {
  const { banner, loaded } = useHomeSellBanner()
  if (loaded && !banner) return null

  const kicker = banner?.kicker || 'Qoldan Qolga'
  const title = banner?.title || t('ads.sellAndEarn')
  const subtitle = banner?.subtitle || t('profile.ctaReviewsHint')
  const ctaText = banner?.ctaText || t('ads.postAd')
  const href = bannerCtaHref(banner?.ctaUrl, ROUTES.ADS_CREATE)
  const artSrc = banner?.imageUrl ? imageUrl(banner.imageUrl) : bannerArt

  return (
    <section className={`${styles.banner} ${className}`.trim()} aria-label={title}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.copy}>
        {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
        <h2 className={styles.title}>
          <span className={styles.accent}>{title}</span>
        </h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        <HomeSellBannerCta href={href} className={styles.cta}>
          {ctaText}
          <i className="bi bi-arrow-up-right" aria-hidden />
        </HomeSellBannerCta>
      </div>
      <div className={styles.artWrap}>
        <img src={artSrc} alt="" className={styles.art} />
      </div>
    </section>
  )
}

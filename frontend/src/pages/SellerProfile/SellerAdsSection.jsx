/**
 * SellerAdsSection — секция объявлений продавца.
 * Табы «Активные»/«Архив» под заголовком; карточки: цена, название, город • дата.
 */
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { imageUrl } from '../../api/client'
import { formatPrice, formatAdCardDate } from '../../utils/formatters'
import { adsPath } from '../../constants/routes'
import HeartIcon from '../../components/ui/HeartIcon'
import ProfileTabs from './ProfileTabs'
import styles from './SellerProfile.module.css'

const STATUS_ACTIVE = 'ACTIVE'

export default function SellerAdsSection({
  ads,
  activeTab,
  onTabChange,
  activeCount,
  archiveCount,
  isAuthenticated,
  sellerId,
  currentUserId,
  onFavoriteClick,
  getFavoriteAriaLabel,
}) {
  const showFavorite = isAuthenticated && sellerId !== currentUserId
  const { t } = useLang()
  const filtered = activeTab === 'active'
    ? ads.filter((a) => a.status === STATUS_ACTIVE)
    : ads.filter((a) => a.status !== STATUS_ACTIVE)

  return (
    <section className={styles.adsSection}>
      <h2 className={styles.adsTitle}>{t('ads.listTitle')}</h2>
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        activeCount={activeCount}
        archiveCount={archiveCount}
      />
      {filtered.length === 0 ? (
        <p className={styles.empty}>{t('ads.noAds')}</p>
      ) : (
        <ul className={styles.adsGrid}>
          {filtered.map((ad) => (
            <li key={ad.id} className={styles.adCard}>
              <Link to={adsPath(ad.id)} className={styles.adLink}>
                {ad.mainImageUrl ? (
                  <img src={imageUrl(ad.mainImageUrl)} alt="" className={styles.adImg} />
                ) : (
                  <div className={styles.adImgPlaceholder} />
                )}
                <div className={styles.adBody}>
                  <span className={styles.adPrice}>{formatPrice(ad.price, ad.currency)}</span>
                  <span className={styles.adTitle}>{ad.title}</span>
                  <span className={styles.adMeta}>
                    {[ad.region, formatAdCardDate(ad.createdAt, { today: t('profile.today'), yesterday: t('profile.yesterday') })].filter(Boolean).join(' • ')}
                  </span>
                </div>
              </Link>
              {showFavorite && (
                <button
                  type="button"
                  className={styles.favBtn}
                  onClick={(e) => { e.preventDefault(); onFavoriteClick(ad) }}
                  aria-label={getFavoriteAriaLabel(ad)}
                >
                  <HeartIcon filled={!!ad.favorite} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

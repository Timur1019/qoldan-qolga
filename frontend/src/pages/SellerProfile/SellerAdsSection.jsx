/**
 * SellerAdsSection — секция объявлений продавца.
 * Табы «Активные»/«Архив»; карточки в той же сетке и стиле, что на главной и в списке объявлений.
 */
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { formatPrice, formatAdCardDate } from '../../utils/formatters'
import { adsPath } from '../../constants/routes'
import HeartIcon from '../../components/ui/HeartIcon'
import CardGallery from '../../features/ad/components/CardGallery'
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
  const showFavorite = sellerId != null && String(sellerId) !== String(currentUserId)
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
            <li key={ad.id} className={`${styles.adCard} app-card app-card-hover`}>
              <Link to={adsPath(ad.id)} className={styles.adLink}>
                <span className={styles.adImgWrap}>
                  <span className={ad.sellerIsStore ? styles.sellerBadgeStore : styles.sellerBadgePrivate}>
                    {ad.sellerIsStore ? 'Магазин' : 'Частный'}
                  </span>
                  <CardGallery
                    imageUrls={ad.imageUrls ?? (ad.mainImageUrl ? [ad.mainImageUrl] : [])}
                  />
                </span>
                <div className={styles.adBody}>
                  <p className={styles.adPrice}>
                    {formatPrice(ad.price, ad.currency)}
                    {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                  </p>
                  {showFavorite && (
                    <button
                      type="button"
                      className={styles.favBtn}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavoriteClick(e, ad) }}
                      aria-label={getFavoriteAriaLabel(ad)}
                    >
                      <HeartIcon
                        filled={!!ad.favorite}
                        className={`${styles.heartIcon} ${ad.favorite ? styles.heartFilled : styles.heartOutline}`}
                        size={18}
                      />
                    </button>
                  )}
                  <h2 className={styles.adTitle}>{ad.title}</h2>
                  {ad.region && <p className={styles.adMeta}>{ad.region}</p>}
                  {ad.createdAt && (
                    <p className={styles.adDate}>
                      {formatAdCardDate(ad.createdAt, { today: t('profile.today'), yesterday: t('profile.yesterday') })}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

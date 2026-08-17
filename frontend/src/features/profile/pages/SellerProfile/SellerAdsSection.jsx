/**
 * SellerAdsSection — секция объявлений продавца.
 * Табы «Активные»/«Архив»; карточки в единой сетке AdCard.
 */
import { useLang } from '../../../../context/LangContext'
import { AdCard, AdCardGrid } from '@/features/ad'
import ProfileTabs from './ProfileTabs'
import styles from './SellerProfile.module.css'

const STATUS_ACTIVE = 'ACTIVE'

export default function SellerAdsSection({
  ads,
  activeTab,
  onTabChange,
  activeCount,
  archiveCount,
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
        <AdCardGrid>
          {filtered.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              t={t}
              showFavorite={showFavorite}
              onFavoriteClick={onFavoriteClick}
              favorite={!!ad.favorite}
              heartAriaLabel={getFavoriteAriaLabel?.(ad)}
            />
          ))}
        </AdCardGrid>
      )}
    </section>
  )
}

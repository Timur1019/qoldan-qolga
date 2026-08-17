import { Link } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { sellerPath } from '../../../../constants/routes'
import UserAvatar from '@/components/ui/UserAvatar'
import useCategoryLabels from '../../hooks/useCategoryLabels'
import FavoritesAdsSection from './FavoritesAdsSection'
import FavoritesEmptyState from './FavoritesEmptyState'
import { useFavoritesPage } from './useFavoritesPage'
import AdCardSkeletonGrid from '../../../../components/ui/AdCardSkeletonGrid/AdCardSkeletonGrid'
import ContentReveal from '../../../../components/ui/ContentReveal/ContentReveal'
import LoadMoreButton from '../../../../components/ui/LoadMoreButton/LoadMoreButton'
import styles from './Favorites.module.css'

function profileAvatarValue(p) {
  const photo =
    p?.avatarUrl ||
    p?.uploadedAvatar ||
    (p?.avatar && (String(p.avatar).startsWith('/') || String(p.avatar).startsWith('http'))
      ? p.avatar
      : null)
  return photo || p?.avatar || ''
}

export default function Favorites() {
  const { t, lang } = useLang()
  const {
    activeTab,
    setActiveTab,
    items,
    recommended,
    profiles,
    profilesLoading,
    loading,
    loadingMore,
    lastPage,
    error,
    loadMore,
    handleRemoveFavorite,
    handleAddFavorite,
    handleUnsubscribe,
  } = useFavoritesPage()

  const ads = items || []
  const recAds = recommended || []
  const categoryLabels = useCategoryLabels([...ads, ...recAds], lang)

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>{t('nav.favorites')}</h1>
        <AdCardSkeletonGrid count={8} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-circle me-2" aria-hidden />
          {error}
        </div>
      </div>
    )
  }

  return (
    <ContentReveal>
      <div className={styles.page}>
      <h1 className={styles.title}>{t('nav.favorites')}</h1>

      <ul className={`nav nav-tabs ${styles.tabs}`}>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            {t('favorites.adsTab')} <span className="badge bg-secondary ms-1">{ads.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'profiles' ? 'active' : ''}`}
            onClick={() => setActiveTab('profiles')}
          >
            {t('favorites.profilesTab')}{' '}
            <span className="badge bg-secondary ms-1">{profiles.length}</span>
          </button>
        </li>
      </ul>

      {activeTab === 'profiles' ? (
        <div className={styles.profilesSection}>
          {profilesLoading ? (
            <p className={styles.loadingText}>{t('common.loading')}</p>
          ) : profiles.length === 0 ? (
            <FavoritesEmptyState variant="profiles" t={t} />
          ) : (
            <ul className={styles.profilesList}>
              {profiles.map((p) => (
                <li key={p.id} className={`app-card ${styles.profileCard}`}>
                  <Link to={sellerPath(p.id)} className={styles.profileCardLink}>
                    <div className={styles.profileCardAvatar}>
                      <UserAvatar avatar={profileAvatarValue(p)} name={p.displayName || ''} size={48} />
                    </div>
                    <div className={styles.profileCardBody}>
                      <h2 className={styles.profileCardName}>{p.displayName || t('ads.seller')}</h2>
                      <p className={styles.profileMeta}>
                        {(p.adsCount ?? 0) > 0
                          ? `${p.adsCount} ${t('ads.sellerAds')}`
                          : t('favorites.noActiveAds')}
                      </p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={(e) => handleUnsubscribe(e, p.id)}
                    title={t('favorites.unsubscribe')}
                  >
                    {t('ads.youAreSubscribed')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          {ads.length === 0 && recAds.length === 0 ? (
            <FavoritesEmptyState variant="ads" t={t} />
          ) : null}

          {ads.length === 0 && recAds.length > 0 ? (
            <div className={styles.emptyHint}>
              <h2 className={styles.emptyHintTitle}>{t('favorites.emptyTitle')}</h2>
              <p className={styles.emptyHintText}>{t('favorites.emptyText')}</p>
            </div>
          ) : null}

          {ads.length > 0 ? (
            <FavoritesAdsSection
              ads={ads}
              t={t}
              categoryLabels={categoryLabels}
              onFavoriteClick={handleRemoveFavorite}
              favorite
              heartAriaLabel={t('common.removeFromFavorites')}
              footer={
                !lastPage ? (
                  <div className={styles.showMoreWrap}>
                    <LoadMoreButton
                      className={styles.showMoreBtn}
                      loading={loadingMore}
                      label={t('common.showMore')}
                      onClick={loadMore}
                    />
                  </div>
                ) : null
              }
            />
          ) : null}

          {recAds.length > 0 ? (
            <FavoritesAdsSection
              title={t('favorites.mayLike')}
              ads={recAds}
              t={t}
              categoryLabels={categoryLabels}
              onFavoriteClick={handleAddFavorite}
              favorite={false}
              heartAriaLabel={t('common.addToFavorites')}
              showDate={false}
            />
          ) : null}
        </>
      )}
      </div>
    </ContentReveal>
  )
}

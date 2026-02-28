import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { adsApi, favoritesApi, usersApi, imageUrl } from '../../services/adApi'
import { formatPrice } from '../../../../utils/formatters'
import { ROUTES, adsPath, sellerPath } from '../../../../constants/routes'
import HeartIcon from '../../../../components/ui/HeartIcon'
import CardGallery from '../../components/CardGallery'
import styles from './Favorites.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

export default function Favorites() {
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('ads')
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [lastPage, setLastPage] = useState(false)
  const [recommended, setRecommended] = useState({ content: [] })
  const [profiles, setProfiles] = useState([])
  const [profilesLoading, setProfilesLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const PAGE_SIZE = 20

  const load = () => {
    setLoading(true)
    Promise.all([
      favoritesApi.list({ page: 0, size: PAGE_SIZE }).catch((e) => {
        setError(e.message)
        return { content: [] }
      }),
      adsApi.list({ page: 0, size: 12 }).catch(() => ({ content: [] })),
    ])
      .then(([favRes, recRes]) => {
        const fav = favRes || { content: [] }
        setItems(fav.content || [])
        const currentPage = typeof fav.number === 'number' ? fav.number : 0
        const totalPages = typeof fav.totalPages === 'number' ? fav.totalPages : 1
        const isLast = typeof fav.last === 'boolean' ? fav.last : currentPage + 1 >= totalPages
        setPage(currentPage)
        setLastPage(isLast)
        setRecommended(recRes || { content: [] })
      })
      .finally(() => setLoading(false))
  }

  const loadMore = () => {
    if (lastPage || loadingMore) return
    const nextPage = page + 1
    setLoadingMore(true)
    favoritesApi
      .list({ page: nextPage, size: PAGE_SIZE })
      .then((res) => {
        const content = res?.content || []
        setItems((prev) => [...prev, ...content])
        const currentPage = typeof res.number === 'number' ? res.number : nextPage
        const totalPages = typeof res.totalPages === 'number' ? res.totalPages : currentPage + 1
        const isLast = typeof res.last === 'boolean' ? res.last : currentPage + 1 >= totalPages
        setPage(currentPage)
        setLastPage(isLast)
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false))
  }

  const loadProfiles = () => {
    setProfilesLoading(true)
    usersApi.getMySubscriptions().then((list) => setProfiles(Array.isArray(list) ? list : [])).catch(() => setProfiles([])).finally(() => setProfilesLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (activeTab === 'profiles') loadProfiles()
  }, [activeTab])

  const handleRemoveFavorite = (e, ad) => {
    e.preventDefault()
    e.stopPropagation()
    adsApi.removeFavorite(ad.id).then(() => {
      setItems((prev) => prev.filter((a) => a.id !== ad.id))
      window.dispatchEvent(new CustomEvent('favorites-count-refresh'))
    }).catch(() => {})
  }

  const handleUnsubscribe = (e, profileId) => {
    e.preventDefault()
    e.stopPropagation()
    usersApi.unsubscribe(profileId).then(() => {
      setProfiles((prev) => prev.filter((p) => p.id !== profileId && String(p.id) !== String(profileId)))
    }).catch(() => {})
  }

  if (loading) {
    return (
      <div className="page-container app-page">
        <p className="text-muted">{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container app-page">
        <div className="alert alert-danger" role="alert"><i className="bi bi-exclamation-circle me-2" aria-hidden />{error}</div>
      </div>
    )
  }

  const ads = items || []
  const recAds = recommended.content || []

  const getProfileAvatar = (p) => {
    const photoUrl = p?.avatarUrl || p?.uploadedAvatar || (p?.avatar && (String(p.avatar).startsWith('/') || String(p.avatar).startsWith('http')) ? p.avatar : null)
    if (photoUrl) return <img src={imageUrl(photoUrl)} alt="" className={styles.profileAvatarImg} />
    const emoji = p?.avatar && AVATAR_EMOJI[p.avatar] ? AVATAR_EMOJI[p.avatar] : null
    if (emoji) return <span className={styles.profileAvatarEmoji} aria-hidden>{emoji}</span>
    const initials = (p?.displayName || '?').trim().split(/\s+/)
    const initial = initials.length >= 2 ? (initials[0][0] + initials[initials.length - 1][0]).toUpperCase() : (p?.displayName || '?').slice(0, 2).toUpperCase()
    return <span className={styles.profileAvatarInitial} aria-hidden>{initial}</span>
  }

  return (
    <div className="page-container app-page">
      <h1 className="h2 mb-3">{t('nav.favorites')}</h1>
      <ul className="nav nav-tabs mb-4">
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
            {t('favorites.profilesTab')} <span className="badge bg-secondary ms-1">{profiles.length}</span>
          </button>
        </li>
      </ul>

      {activeTab === 'profiles' ? (
        <div className={styles.profilesSection}>
          {profilesLoading ? (
            <p className="text-muted">{t('common.loading')}</p>
          ) : profiles.length === 0 ? (
            <div className="app-card text-center py-5 px-3">
              <i className="bi bi-person-heart display-4 text-muted opacity-50 mb-3" aria-hidden />
              <h2 className="h5 mb-2">{t('favorites.profilesEmptyTitle')}</h2>
              <p className="text-muted small mb-0">{t('favorites.profilesEmptyText')}</p>
            </div>
          ) : (
            <ul className={styles.profilesList}>
              {profiles.map((p) => (
                <li key={p.id} className={`app-card ${styles.profileCard}`}>
                  <Link to={sellerPath(p.id)} className={styles.profileCardLink}>
                    <div className={styles.profileCardAvatar}>{getProfileAvatar(p)}</div>
                    <div className={styles.profileCardBody}>
                      <h2 className={styles.profileCardName}>{p.displayName || t('ads.seller')}</h2>
                      <p className="text-muted small mb-0">
                        {(p.adsCount ?? 0) > 0 ? `${p.adsCount} ${t('ads.sellerAds')}` : t('favorites.noActiveAds')}
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
      ) : ads.length === 0 ? (
        <div className="app-card text-center py-5 px-3">
          <i className="bi bi-heart display-4 text-muted opacity-50 mb-3" aria-hidden />
          <h2 className="h5 mb-2">{t('favorites.emptyTitle')}</h2>
          <p className="text-muted small mb-3">{t('favorites.emptyText')}</p>
          <Link to={ROUTES.ADS_MY} className="btn btn-primary">{t('home.viewAds')}</Link>
        </div>
      ) : (
        <>
          <ul className={styles.grid}>
            {ads.map((ad) => (
              <li key={ad.id} className={`${styles.card} app-card app-card-hover`}>
                <Link to={adsPath(ad.id)} className={styles.cardLink}>
                  <span className={styles.cardImageWrap}>
                    <span className={`badge position-absolute top-0 start-0 m-2 ${ad.sellerIsStore ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                      {ad.sellerIsStore ? 'Магазин' : 'Частный'}
                    </span>
                    <CardGallery
                      imageUrls={ad.imageUrls ?? (ad.mainImageUrl ? [ad.mainImageUrl] : [])}
                    />
                    <button
                      type="button"
                      className={`${styles.favoriteBtn} btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle p-0`}
                      onClick={(e) => handleRemoveFavorite(e, ad)}
                      aria-label={t('common.removeFromFavorites')}
                    >
                      <HeartIcon filled className={`${styles.heartIcon} ${styles.heartFilled}`} size={20} />
                    </button>
                  </span>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{ad.title}</h2>
                    <p className={styles.cardPrice}>
                      {formatPrice(ad.price, ad.currency)}
                      {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                    </p>
                    {(ad.region || ad.category) && (
                      <p className={styles.cardMeta}>
                        {ad.category}
                        {ad.region && ` · ${ad.region}`}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {!lastPage && (
            <div className="text-center mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? t('common.loading') : t('favorites.showMore')}
              </button>
            </div>
          )}
        </>
      )}
      {recAds.length > 0 && (
        <section className="mt-5">
          <h2 className="h5 mb-3">{t('favorites.mayLike')}</h2>
          <ul className={styles.recommendGrid}>
            {recAds.map((ad) => (
              <li key={ad.id} className={`${styles.recommendCard} app-card app-card-hover`}>
                <Link to={adsPath(ad.id)} className={styles.cardLink}>
                  <span className={styles.cardImageWrap}>
                    <span className={`badge position-absolute top-0 start-0 m-2 ${ad.sellerIsStore ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                      {ad.sellerIsStore ? 'Магазин' : 'Частный'}
                    </span>
                    <CardGallery
                      imageUrls={ad.imageUrls ?? (ad.mainImageUrl ? [ad.mainImageUrl] : [])}
                    />
                  </span>
                  <div className={styles.cardBody}>
                    <p className={styles.cardPrice}>
                      {formatPrice(ad.price, ad.currency)}
                      {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                    </p>
                    <h2 className={styles.cardTitle}>{ad.title}</h2>
                    {(ad.region || ad.category) && (
                      <p className={styles.cardMeta}>
                        {ad.category}
                        {ad.region && ` · ${ad.region}`}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

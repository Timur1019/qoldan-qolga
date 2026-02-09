import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { adsApi, imageUrl } from '../../api/client'
import { ROUTES, adsEditPath } from '../../constants/routes'
import styles from './MyAds.module.css'

function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  return `${Number(price).toLocaleString()} ${currency}`
}

const STATUS_ACTIVE = 'ACTIVE'
const STATUS_ARCHIVED = 'ARCHIVED'

const TABS = [
  { key: 'active', labelKey: 'profile.tabActive', status: STATUS_ACTIVE },
  { key: 'drafts', labelKey: 'profile.tabDrafts', status: null },
  { key: 'pending', labelKey: 'profile.tabPending', status: null },
  { key: 'archive', labelKey: 'profile.tabArchive', status: STATUS_ARCHIVED },
]

export default function MyAds() {
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('active')
  const [data, setData] = useState({ content: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const loadAds = () => {
    adsApi
      .myAds()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadAds()
  }, [])

  const handleDelete = (ad) => {
    setOpenMenuId(null)
    if (!window.confirm(t('ads.confirmDeleteAd'))) return
    adsApi
      .delete(ad.id)
      .then(() => setData((prev) => ({ ...prev, content: prev.content.filter((a) => a.id !== ad.id) })))
      .catch((e) => setError(e.message))
  }

  const handleArchive = (ad) => {
    setOpenMenuId(null)
    if (!window.confirm(t('ads.confirmCloseAd'))) return
    adsApi
      .archive(ad.id)
      .then(() =>
        setData((prev) => ({
          ...prev,
          content: prev.content.map((a) => (a.id === ad.id ? { ...a, status: STATUS_ARCHIVED } : a)),
        }))
      )
      .catch((e) => setError(e.message))
  }

  const handleRestore = (ad) => {
    setOpenMenuId(null)
    if (!window.confirm(t('ads.confirmRestoreAd'))) return
    adsApi
      .restore(ad.id)
      .then(() =>
        setData((prev) => ({
          ...prev,
          content: prev.content.map((a) => (a.id === ad.id ? { ...a, status: STATUS_ACTIVE } : a)),
        }))
      )
      .catch((e) => setError(e.message))
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  const allAds = data.content || []
  const activeAds = allAds.filter((a) => a.status === STATUS_ACTIVE)
  const archiveAds = allAds.filter((a) => a.status === STATUS_ARCHIVED)
  const draftsCount = allAds.filter((a) => a.status === 'DRAFT').length
  const pendingCount = allAds.filter((a) => a.status === 'PENDING').length
  const adsForTab =
    activeTab === 'active' ? activeAds : activeTab === 'archive' ? archiveAds : []

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <section className={styles.useful} aria-label={t('profile.usefulForYou')}>
          <h2 className={styles.usefulTitle}>{t('profile.usefulForYou')}</h2>
          <div className={styles.usefulCards}>
            <div className={styles.usefulCard}>
              <div className={styles.usefulCardIcon} aria-hidden />
              <h3 className={styles.usefulCardTitle}>{t('profile.sellGuide')}</h3>
              <button type="button" className={styles.guideBtn}>{t('profile.guide')}</button>
            </div>
            <div className={styles.usefulCard}>
              <div className={styles.usefulCardIconShield} aria-hidden />
              <h3 className={styles.usefulCardTitle}>{t('profile.sellerSafety')}</h3>
              <button type="button" className={styles.guideBtn}>{t('profile.guide')}</button>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.myAdsSection}>
        <h1 className={styles.title}>{t('ads.myAdsTitle')}</h1>
        <div className={styles.tabs} role="tablist">
          {TABS.map((tab) => {
            const count =
              tab.key === 'active' ? activeAds.length : tab.key === 'archive' ? archiveAds.length : tab.key === 'drafts' ? draftsCount : pendingCount
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={activeTab === tab.key ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab(tab.key)}
              >
                {t(tab.labelKey)}
                {count > 0 && <span className={styles.tabBadge}>{count}</span>}
              </button>
            )
          })}
        </div>

        {activeTab === 'active' && activeAds.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <p className={styles.emptyText}>{t('profile.myAdsEmpty')}</p>
            <Link to={ROUTES.ADS_CREATE} className={styles.placeAdBtn}>
              {t('profile.placeAd')}
            </Link>
          </div>
        )}

        {activeTab === 'archive' && archiveAds.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <p className={styles.emptyText}>{t('profile.archiveEmpty')}</p>
          </div>
        )}

        {(activeTab === 'drafts' || activeTab === 'pending') && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <p className={styles.emptyText}>{t('profile.myAdsEmpty')}</p>
          </div>
        )}

        {(activeTab === 'active' || activeTab === 'archive') && adsForTab.length > 0 && (
          <>
            <ul className={styles.grid}>
              {adsForTab.map((ad) => (
                <li
                  key={ad.id}
                  className={ad.status === STATUS_ARCHIVED ? `${styles.card} ${styles.cardArchived}` : styles.card}
                >
                  <div className={styles.cardHeader} ref={openMenuId === ad.id ? menuRef : null}>
                    <Link to={`/ads/${ad.id}`} className={styles.cardLink}>
                      {ad.mainImageUrl ? (
                        <img src={imageUrl(ad.mainImageUrl)} alt="" className={styles.cardImage} />
                      ) : (
                        <div className={styles.cardImagePlaceholder} />
                      )}
                      <div className={styles.cardBody}>
                        <h2 className={styles.cardTitle}>{ad.title}</h2>
                        <p className={styles.cardPrice}>
                          {formatPrice(ad.price, ad.currency)}
                          {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      className={styles.cardMenuBtn}
                      onClick={(e) => { e.preventDefault(); setOpenMenuId((id) => (id === ad.id ? null : ad.id)) }}
                      aria-expanded={openMenuId === ad.id}
                      aria-haspopup="true"
                      aria-label={t('ads.adMenu')}
                    >
                      <span className={styles.cardMenuDots}>⋯</span>
                    </button>
                    {openMenuId === ad.id && (
                      <div className={styles.cardDropdown} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className={styles.cardDropdownItem}
                          onClick={() => { setOpenMenuId(null) }}
                        >
                          {t('ads.buyAdvertising')}
                        </button>
                        <Link
                          to={adsEditPath(ad.id)}
                          className={styles.cardDropdownItem}
                          onClick={() => setOpenMenuId(null)}
                        >
                          {t('chat.edit')}
                        </Link>
                        <button
                          type="button"
                          className={styles.cardDropdownItem}
                          onClick={() => { setOpenMenuId(null) }}
                        >
                          {t('ads.adStatistics')}
                        </button>
                        {ad.status === STATUS_ACTIVE && (
                          <button
                            type="button"
                            className={styles.cardDropdownItemDanger}
                            onClick={() => handleArchive(ad)}
                          >
                            {t('ads.closeAd')}
                          </button>
                        )}
                        {ad.status === STATUS_ARCHIVED && (
                          <button
                            type="button"
                            className={styles.cardDropdownItem}
                            onClick={() => handleRestore(ad)}
                          >
                            {t('ads.restoreFromArchive')}
                          </button>
                        )}
                        <button
                          type="button"
                          className={styles.cardDropdownItemDanger}
                          onClick={() => handleDelete(ad)}
                        >
                          {t('chat.delete')}
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.placeAdWrap}>
              <Link to={ROUTES.ADS_CREATE} className={styles.placeAdBtn}>
                {t('profile.placeAd')}
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

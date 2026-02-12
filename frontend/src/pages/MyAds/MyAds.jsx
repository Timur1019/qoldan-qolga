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
  const [promoModalAd, setPromoModalAd] = useState(null)
  const [selectedPromoService, setSelectedPromoService] = useState(null)
  const [promoWarning, setPromoWarning] = useState('')
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

  const openPromoModal = (ad) => {
    setOpenMenuId(null)
    setPromoModalAd(ad)
    setSelectedPromoService(null)
    setPromoWarning('')
  }

  const closePromoModal = () => {
    setPromoModalAd(null)
    setSelectedPromoService(null)
    setPromoWarning('')
  }

  const handlePromoPay = () => {
    if (!selectedPromoService) {
      setPromoWarning(t('ads.promoSelectServiceWarning'))
      return
    }
    if (!promoModalAd) return
    setPromoWarning('')
    adsApi
      .createPromoOrder(promoModalAd.id, { serviceCode: selectedPromoService })
      .then(() => {
        closePromoModal()
      })
      .catch((e) => {
        setPromoWarning(e.message || t('common.error'))
      })
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
  const pendingAds = allAds.filter((a) => a.status === 'PENDING')
  const draftsCount = allAds.filter((a) => a.status === 'DRAFT').length
  const pendingCount = pendingAds.length
  const adsForTab =
    activeTab === 'active' ? activeAds
    : activeTab === 'archive' ? archiveAds
    : activeTab === 'pending' ? pendingAds
    : []

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

        {activeTab === 'drafts' && (
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

        {activeTab === 'pending' && pendingAds.length === 0 && (
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

        {(activeTab === 'active' || activeTab === 'archive' || activeTab === 'pending') && adsForTab.length > 0 && (
          <ul className={styles.list}>
            {adsForTab.map((ad) => {
              const mainUrl = (ad.imageUrls && ad.imageUrls[0]) || ad.mainImageUrl
              return (
                <li
                  key={ad.id}
                  className={ad.status === STATUS_ARCHIVED ? `${styles.row} ${styles.rowArchived}` : styles.row}
                >
                  <div className={styles.rowInner} ref={openMenuId === ad.id ? menuRef : null}>
                    <Link to={`/ads/${ad.id}`} className={styles.rowLink}>
                      <span className={styles.rowImageWrap}>
                        {mainUrl ? (
                          <img src={imageUrl(mainUrl)} alt="" className={styles.rowImage} />
                        ) : (
                          <div className={styles.rowImagePlaceholder} />
                        )}
                      </span>
                      <div className={styles.rowBody}>
                        <h2 className={styles.rowTitle}>{ad.title}</h2>
                        <p className={styles.rowPrice}>
                          {formatPrice(ad.price, ad.currency)}
                          {ad.isNegotiable && ` (${t('ads.negotiable')})`}
                        </p>
                        {ad.status === 'PENDING' && (
                          <p className={styles.rowStatusPending}>{t('ads.statusPending')}</p>
                        )}
                        <button
                          type="button"
                          className={styles.rowBuyPromo}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); openPromoModal(ad) }}
                        >
                          {t('ads.buyAdvertising')}
                        </button>
                      </div>
                    </Link>
                    <button
                      type="button"
                      className={styles.rowMenuBtn}
                      onClick={(e) => { e.preventDefault(); setOpenMenuId((id) => (id === ad.id ? null : ad.id)) }}
                      aria-expanded={openMenuId === ad.id}
                      aria-haspopup="true"
                      aria-label={t('ads.adMenu')}
                    >
                      <span className={styles.rowMenuDots}>⋯</span>
                    </button>
                    {openMenuId === ad.id && (
                      <div className={styles.rowDropdown} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className={styles.cardDropdownItem}
                          onClick={() => openPromoModal(ad)}
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
                          onClick={() => setOpenMenuId(null)}
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
              )
            })}
          </ul>
        )}
      </section>

      {promoModalAd && (
        <div className={styles.promoOverlay} onClick={closePromoModal} role="dialog" aria-modal="true" aria-labelledby="promo-modal-title">
          <div className={styles.promoModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.promoModalHeader}>
              <h2 id="promo-modal-title" className={styles.promoModalTitle}>{t('ads.promoModalTitle')}</h2>
              <button
                type="button"
                className={styles.promoModalClose}
                onClick={closePromoModal}
                aria-label={t('common.cancel')}
              >
                ✕
              </button>
            </div>
            <div className={styles.promoModalBody}>
              <div className={styles.promoOption}>
                <label className={styles.promoOptionLabel}>
                  <input
                    type="radio"
                    name="promoService"
                    checked={selectedPromoService === 'maxi'}
                    onChange={() => { setSelectedPromoService('maxi'); setPromoWarning('') }}
                    className={styles.promoRadio}
                  />
                  <span className={styles.promoOptionTitle}>{t('ads.promoServiceMaxi')}</span>
                </label>
                <p className={styles.promoOptionPrice}>{t('ads.promoServiceMaxiPrice')}</p>
              </div>
              <div className={styles.promoOption}>
                <label className={styles.promoOptionLabel}>
                  <input
                    type="radio"
                    name="promoService"
                    checked={selectedPromoService === 'up'}
                    onChange={() => { setSelectedPromoService('up'); setPromoWarning('') }}
                    className={styles.promoRadio}
                  />
                  <span className={styles.promoOptionTitle}>{t('ads.promoServiceUp')}</span>
                </label>
                <p className={styles.promoOptionPrice}>{t('ads.promoServiceUpPrice')}</p>
                <p className={styles.promoOptionDesc}>{t('ads.promoServiceUpDesc')}</p>
              </div>
              {promoWarning && (
                <p className={styles.promoWarning} role="alert">{promoWarning}</p>
              )}
            </div>
            <div className={styles.promoModalFooter}>
              <button
                type="button"
                className={styles.promoPayBtn}
                onClick={handlePromoPay}
              >
                {t('ads.promoPayBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

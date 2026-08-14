import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { useLang } from '../../../../context/LangContext'
import { useRegionLabel } from '../../../../context/RegionsContext'
import { adsCategoryPath, sellerPath } from '../../../../constants/routes'
import { useAdDetail } from '../../hooks/useAdDetail'
import { useAdActions } from '../../hooks/useAdActions'
import { usePriceWatch } from '../../hooks/usePriceWatch'
import { usersApi, imageUrl, referenceApi } from '../../services/adApi'
import AdGallery from '../../components/AdGallery/AdGallery'
import PricePanel from '../../components/PricePanel'
import AdDescription from '../../components/AdDescription'
import AdLocation from '../../components/AdLocation'
import SellerInfo from '../../components/SellerInfo'
import SellerAds from '../../components/SellerAds'
import SimilarAdsSection from '../../components/SimilarAdsSection/SimilarAdsSection'
import PriceInsight from '../../components/PriceInsight/PriceInsight'
import { buildPriceInsight } from '../../utils/priceInsight'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import { formatDate, maskPhone } from '../../utils/adFormatters'
import { extractLocationFromDescription } from '../../utils/descriptionLocation'
import { REPORT_REASONS } from '../../utils/constants'
import { isSellerStore } from '../../utils/isSellerStore'
import { currencyApi } from '../../services/adApi'
import styles from './AdDetail.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

export default function AdDetail() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const { isAuthenticated, user } = useAuth()
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [askText, setAskText] = useState('')
  const [sellerSubscribed, setSellerSubscribed] = useState(null)
  const [phoneRevealed, setPhoneRevealed] = useState(false)
  const [categoryName, setCategoryName] = useState(null)
  const [usdToUzs, setUsdToUzs] = useState(12800)

  const {
    ad,
    loading,
    error,
    setError,
    sellerProfile,
    sellerAds,
    similar,
    reviewsSummary,
    setAd,
  } = useAdDetail(id)

  const regionLabel = useRegionLabel(ad?.region)

  const actions = useAdActions(ad, user, { setAd, setError })
  const priceWatch = usePriceWatch(ad)

  useEffect(() => {
    currencyApi
      .getRate()
      .then((rate) => {
        const value = Number(rate?.usdToUzs)
        if (value > 0) setUsdToUzs(value)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!ad?.userId || ad.userId === user?.id || !isAuthenticated) return
    usersApi.getProfile(ad.userId).then((p) => setSellerSubscribed(p.subscribed ?? false)).catch(() => setSellerSubscribed(false))
  }, [ad?.userId, user?.id, isAuthenticated])

  useEffect(() => {
    if (!ad) {
      setCategoryName(null)
      return
    }
    if (ad.category) {
      referenceApi.getCategory(ad.category).then((c) => {
        if (c) setCategoryName(lang === 'ru' ? c.nameRu : c.nameUz)
        else setCategoryName(ad.category)
      }).catch(() => setCategoryName(ad.category))
    } else {
      setCategoryName(null)
    }
  }, [ad?.id, ad?.category, lang])

  const handleReportClick = () => {
    if (actions.handleReport() === true) {
      setReportModalOpen(true)
      setReportReason('')
    }
  }

  const handleReportSubmit = async () => {
    if (!reportReason || !ad) return
    setReportSubmitting(true)
    try {
      await actions.submitReport(ad.id, reportReason)
      setReportModalOpen(false)
      setReportReason('')
    } finally {
      setReportSubmitting(false)
    }
  }

  const handleSubscribeWithState = () => {
    actions.handleSubscribe(setSellerSubscribed)
  }

  const handlePhoneClick = () => {
    if (!isAuthenticated) {
      actions.openAuthModal?.()
      return
    }
    setPhoneRevealed(true)
  }

  if (loading) {
    return (
      <div className="page-container app-page">
        <p className="text-muted">{t('common.loading')}</p>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className="page-container app-page">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-circle me-2" aria-hidden /> {error || t('ads.noAds')}
        </div>
        <Link to="/" className="btn btn-outline-primary btn-sm">{t('common.back')}</Link>
      </div>
    )
  }

  const categoryLabel = categoryName ?? ad.category ?? '—'
  const locationFromDescription = extractLocationFromDescription(ad.description)
  const sellerDisplayName = sellerProfile?.displayName ?? ad.userDisplayName ?? t('ads.seller')
  const sellerAvatar = sellerProfile?.avatar
  const avgRating = reviewsSummary?.averageRating ?? 0
  const totalReviews = reviewsSummary?.totalCount ?? 0
  const ratingText = totalReviews > 0
    ? `${avgRating.toFixed(1)} (${totalReviews})`
    : t('reviews.noReviews')
  const priceInsight = buildPriceInsight(ad, similar?.content, usdToUzs)

  return (
    <div className={`page-container app-page ${styles.widePage}`}>
      <div className={`d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 ${styles.topBar}`}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">{t('nav.home')}</Link></li>
            <li className="breadcrumb-item">
              <Link to={adsCategoryPath(ad.category)} className="d-inline-flex align-items-center gap-1">
                <CategoryIcon code={ad.category} />
                {categoryLabel}
              </Link>
            </li>
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '200px' }} aria-current="page">{ad.title.length > 50 ? ad.title.slice(0, 50) + '…' : ad.title}</li>
          </ol>
        </nav>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={actions.handleFavorite}
          aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
        >
          <i className={`bi ${ad.favorite ? 'bi-heart-fill' : 'bi-heart'} me-1`} aria-hidden />
          {ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.threeCol}>
          <div className={styles.leftCol}>
            <div className={styles.leftCard}>
              <AdGallery
                images={ad.images}
                overlay={<PriceInsight insight={priceInsight} t={t} overlay />}
                lightboxFooter={ad.userId ? (
                  <div className={styles.lightboxFooterWrap}>
                    <div className={styles.lightboxFooterSeller}>
                      <div className={styles.lightboxFooterAvatarWrap}>
                        {sellerAvatar && (sellerAvatar.startsWith('/') || sellerAvatar.startsWith('http')) ? (
                          <img src={imageUrl(sellerAvatar)} alt="" className={styles.lightboxFooterAvatar} />
                        ) : sellerAvatar && AVATAR_EMOJI[sellerAvatar] ? (
                          <span className={styles.lightboxFooterEmoji} aria-hidden>{AVATAR_EMOJI[sellerAvatar]}</span>
                        ) : (
                          <span className={styles.lightboxFooterInitial} aria-hidden>
                            {sellerDisplayName?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <Link to={sellerPath(ad.userId)} className={styles.lightboxFooterName} onClick={(e) => e.stopPropagation()}>
                          {sellerDisplayName} ›
                        </Link>
                        {sellerProfile?.createdAt && (
                          <div className={styles.lightboxFooterSince}>
                            {t('ads.onPlatformSince')} {new Date(sellerProfile.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={(e) => { e.stopPropagation(); actions.handleWriteSeller() }}
                        disabled={actions.chatGoing || ad.userId === user?.id}
                      >
                        <i className="bi bi-chat-dots me-1" aria-hidden /> {actions.chatGoing ? t('common.loading') : t('ads.chatWith')}
                      </button>
                      {phoneRevealed && ad.phone ? (
                        <span className="d-flex align-items-center gap-2">
                          <span className="small">+{(ad.phone || '').replace(/\D/g, '')}</span>
                          <a href={`tel:${(ad.phone || '').replace(/\D/g, '')}`} className="btn btn-outline-success btn-sm" onClick={(e) => e.stopPropagation()}>
                            <i className="bi bi-telephone me-1" aria-hidden /> {t('ads.call')}
                          </a>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={(e) => { e.stopPropagation(); handlePhoneClick() }}
                          title={!isAuthenticated ? t('ads.phoneLoginRequired') : t('ads.phone')}
                        >
                          <i className="bi bi-telephone me-1" aria-hidden /> {ad.phone ? (maskPhone(ad.phone) ?? t('ads.phone')) : t('ads.phone')}
                        </button>
                      )}
                      {(ad.telegramUsername?.trim() || ((ad.phone || '').replace(/\D/g, '').length >= 9)) && (
                        <a
                          href={ad.telegramUsername?.trim()
                            ? `https://t.me/${String(ad.telegramUsername).replace(/^@/, '').trim()}`
                            : `https://t.me/+${(ad.phone || '').replace(/\D/g, '').slice(-12)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="bi bi-send me-1" aria-hidden />
                          {lang === 'ru' ? 'Написать в Telegram' : 'Telegramda yozish'}
                        </a>
                      )}
                    </div>
                  </div>
                ) : null}
              />
            </div>
            <div className={styles.leftCard}>
              <AdDescription
                ad={ad}
                categoryLabel={categoryLabel}
                regionLabel={regionLabel}
                isAuthenticated={isAuthenticated}
                isOwner={ad.userId === user?.id}
                askText={askText}
                onAskChange={setAskText}
                onAskSend={(text) => {
                  actions.handleSendFromAsk?.(text)
                  setAskText('')
                }}
                chatGoing={actions.chatGoing}
              />
              <AdLocation
                region={regionLabel || ad.region}
                district={ad.district}
                address={ad.address || locationFromDescription.address}
                landmark={ad.landmark || locationFromDescription.landmark}
                canDeliver={ad.canDeliver}
              />
            </div>
            <div className={styles.leftCard}>
              <div className={styles.adMeta}>
                <div className={styles.adMetaRow}>
                  <span className={styles.adMetaLabel}>{t('ads.adId')}</span>
                  <span className={styles.adMetaValue} title={ad.id}>
                    {ad.id ? String(ad.id).replace(/-/g, '').slice(0, 8).toUpperCase() : '—'}
                  </span>
                </div>
                <div className={styles.adMetaRow}>
                  <span className={styles.adMetaLabel}>{t('ads.postedAt')}</span>
                  <span className={styles.adMetaValue}>{formatDate(ad.createdAt)}</span>
                </div>
              </div>
              <div className="mt-2">
                {ad.userId !== user?.id && (
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleReportClick}>
                    <i className="bi bi-flag me-1" aria-hidden /> {t('ads.report')}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.rightCard}>
              <PricePanel
                ad={ad}
                onChat={actions.handleWriteSeller}
                chatGoing={actions.chatGoing}
                isOwner={ad.userId === user?.id}
                isAuthenticated={isAuthenticated}
                phoneRevealed={phoneRevealed}
                onPhoneClick={handlePhoneClick}
                priceWatching={priceWatch.watching}
                onTrackPrice={priceWatch.toggle}
              />
              {ad.userId && (
                <SellerInfo
                  sellerId={ad.userId}
                  sellerDisplayName={sellerDisplayName}
                  sellerAvatar={sellerAvatar}
                  sellerIsStore={isSellerStore(ad)}
                  sellerType={ad.sellerType}
                  adsCount={sellerProfile?.adsCount ?? 0}
                  sinceIso={sellerProfile?.createdAt}
                  ratingText={ratingText}
                  subscribed={sellerSubscribed}
                  isOwner={ad.userId === user?.id}
                  onSubscribe={handleSubscribeWithState}
                />
              )}
            </div>
          </div>
        </div>

        <SellerAds ads={sellerAds.content} titleKey="ads.sellerAdsTitle" />
        <SimilarAdsSection ads={(similar.content || []).slice(0, 10)} />
      </div>

      {reportModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setReportModalOpen(false)}>
          <div className="app-card border-0 shadow p-0 overflow-hidden" style={{ maxWidth: '400px', width: '100%' }} onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="report-modal-title">
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
              <h2 id="report-modal-title" className="h6 mb-0">{t('ads.reportModalTitle')}</h2>
              <button
                type="button"
                className="btn btn-link p-0 text-secondary text-decoration-none"
                onClick={() => setReportModalOpen(false)}
                aria-label={t('common.cancel')}
              >
                <i className="bi bi-x-lg" aria-hidden />
              </button>
            </div>
            <div className="p-3">
              {REPORT_REASONS.map((r) => (
                <div key={r.value} className="form-check mb-2">
                  <input
                    type="radio"
                    name="reportReason"
                    id={`report-${r.value}`}
                    value={r.value}
                    checked={reportReason === r.value}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor={`report-${r.value}`}>{t(r.labelKey)}</label>
                </div>
              ))}
            </div>
            <div className="p-3 border-top">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleReportSubmit}
                disabled={!reportReason || reportSubmitting}
              >
                {reportSubmitting ? t('common.loading') : t('ads.reportNext')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

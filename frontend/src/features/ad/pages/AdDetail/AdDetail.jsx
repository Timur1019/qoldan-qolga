import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { useLang } from '../../../../context/LangContext'
import { adsPath, adsCategoryPath, sellerPath } from '../../../../constants/routes'
import { useAdDetail } from '../../hooks/useAdDetail'
import { useAdActions } from '../../hooks/useAdActions'
import { usersApi, imageUrl } from '../../services/adApi'
import AdGallery from '../../components/AdGallery/AdGallery'
import PricePanel from '../../components/PricePanel'
import AdDescription from '../../components/AdDescription'
import AdLocation from '../../components/AdLocation'
import SellerInfo from '../../components/SellerInfo'
import SellerAds from '../../components/SellerAds'
import { formatDate } from '../../utils/adFormatters'
import { REPORT_REASONS } from '../../utils/constants'
import styles from './AdDetail.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

export default function AdDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const { isAuthenticated, user } = useAuth()
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [askText, setAskText] = useState('')
  const [sellerSubscribed, setSellerSubscribed] = useState(null)

  const {
    ad,
    loading,
    error,
    setError,
    sellerProfile,
    sellerAds,
    reviewsSummary,
    setAd,
  } = useAdDetail(id)

  const actions = useAdActions(ad, user, { setAd, setError })

  useEffect(() => {
    if (!ad?.userId || ad.userId === user?.id || !isAuthenticated) return
    usersApi.getProfile(ad.userId).then((p) => setSellerSubscribed(p.subscribed ?? false)).catch(() => setSellerSubscribed(false))
  }, [ad?.userId, user?.id, isAuthenticated])

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

  if (loading) {
    return (
      <div className={styles.page}>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || t('ads.noAds')}</p>
        <Link to="/ads">{t('common.back')}</Link>
      </div>
    )
  }

  const categoryLabel = ad.category || '—'
  const sellerDisplayName = sellerProfile?.displayName ?? ad.userDisplayName ?? t('ads.seller')
  const sellerAvatar = sellerProfile?.avatar
  const avgRating = reviewsSummary?.averageRating ?? 0
  const totalReviews = reviewsSummary?.totalCount ?? 0
  const ratingText = totalReviews > 0
    ? `${avgRating.toFixed(1)} (${totalReviews})`
    : t('reviews.noReviews')

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">{t('nav.home')}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link to={adsCategoryPath(ad.category)}>{categoryLabel}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{ad.title.length > 50 ? ad.title.slice(0, 50) + '…' : ad.title}</span>
        </nav>
        <button
          type="button"
          className={styles.favoriteBtnTop}
          onClick={actions.handleFavorite}
          aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
        >
          <span className={styles.favoriteHeart} aria-hidden>{ad.favorite ? '♥' : '♡'}</span>
          <span>{ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}</span>
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.threeCol}>
          <div className={styles.leftCol}>
            <div className={styles.leftCard}>
              <AdGallery
                images={ad.images}
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
                    <div className={styles.lightboxFooterBtns}>
                      <button
                        type="button"
                        className={styles.lightboxFooterBtnChat}
                        onClick={(e) => { e.stopPropagation(); actions.handleWriteSeller() }}
                        disabled={actions.chatGoing || ad.userId === user?.id}
                      >
                        {actions.chatGoing ? t('common.loading') : t('ads.chatWith')}
                      </button>
                      <a href={`tel:${(ad.phone || '').replace(/\D/g, '')}`} className={styles.lightboxFooterBtnPhone} onClick={(e) => e.stopPropagation()}>
                        {t('ads.phone')}
                      </a>
                      <a
                        href={`https://t.me/${(ad.phone || '').replace(/\D/g, '').slice(-9)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.lightboxFooterBtnTelegram}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className={styles.lightboxFooterBtnTelegramIcon} aria-hidden>✈</span>
                        Telegram
                      </a>
                    </div>
                  </div>
                ) : null}
              />
            </div>
            <div className={styles.leftCard}>
              <AdDescription
                ad={ad}
                categoryLabel={categoryLabel}
                isAuthenticated={isAuthenticated}
                isOwner={ad.userId === user?.id}
                askText={askText}
                onAskChange={setAskText}
                onAskSend={actions.handleWriteSeller}
                chatGoing={actions.chatGoing}
              />
              <AdLocation
                region={ad.region}
                district={ad.district}
                address={ad.address}
                landmark={ad.landmark}
                canDeliver={ad.canDeliver}
              />
            </div>
            <div className={styles.leftCard}>
              <div className={styles.adMeta}>
                <div className={styles.adMetaRow}>
                  <span className={styles.adMetaLabel}>{t('ads.adId')}</span>
                  <span className={styles.adMetaValue}>{ad.id}</span>
                </div>
                <div className={styles.adMetaRow}>
                  <span className={styles.adMetaLabel}>{t('ads.postedAt')}</span>
                  <span className={styles.adMetaValue}>{formatDate(ad.createdAt)}</span>
                </div>
              </div>
              <div className={styles.actionBtns}>
                {ad.userId !== user?.id && (
                  <button type="button" className={styles.reportBtn} onClick={handleReportClick}>
                    {t('ads.report')}
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
              />
              {ad.userId && (
                <SellerInfo
                  sellerId={ad.userId}
                  sellerDisplayName={sellerDisplayName}
                  sellerAvatar={sellerAvatar}
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

        <SellerAds ads={sellerAds.content} />
      </div>

      {reportModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setReportModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="report-modal-title">
            <div className={styles.modalHeader}>
              <h2 id="report-modal-title" className={styles.modalTitle}>{t('ads.reportModalTitle')}</h2>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setReportModalOpen(false)}
                aria-label={t('common.cancel')}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {REPORT_REASONS.map((r) => (
                <label key={r.value} className={styles.reportReasonLabel}>
                  <input
                    type="radio"
                    name="reportReason"
                    value={r.value}
                    checked={reportReason === r.value}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>{t(r.labelKey)}</span>
                </label>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.reportSubmitBtn}
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

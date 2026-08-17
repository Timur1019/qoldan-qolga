import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'
import { useLang } from '../../../../context/LangContext'
import { useRegionLabel } from '../../../../context/RegionsContext'
import { useIsMobile } from '../../../../hooks'
import { useAdDetail } from '../../hooks/useAdDetail'
import { useAdActions } from '../../hooks/useAdActions'
import useAdDetailExtras from '../../hooks/useAdDetailExtras'
import { usePriceWatch } from '../../hooks/usePriceWatch'
import AdGallery from '../../components/AdGallery/AdGallery'
import PricePanel from '../../components/PricePanel'
import AdDescription from '../../components/AdDescription'
import AdLocation from '../../components/AdLocation'
import SellerInfo from '../../components/SellerInfo'
import SellerAds from '../../components/SellerAds'
import SimilarAdsSection from '../../components/SimilarAdsSection/SimilarAdsSection'
import PriceInsight from '../../components/PriceInsight/PriceInsight'
import AdDetailTopBar from '../../components/AdDetailTopBar'
import AdDetailMeta from '../../components/AdDetailMeta'
import AdGallerySellerFooter from '../../components/AdGallerySellerFooter'
import AdReportModal from '../../components/AdReportModal'
import { buildPriceInsight } from '../../utils/priceInsight'
import { extractLocationFromDescription } from '../../utils/descriptionLocation'
import { isSellerStore } from '../../utils/isSellerStore'
import styles from './AdDetail.module.css'

export default function AdDetail() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const isMobile = useIsMobile()
  const { isAuthenticated, user } = useAuth()

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

  const extras = useAdDetailExtras(ad, user, isAuthenticated, lang)
  const regionLabel = useRegionLabel(ad?.region)
  const actions = useAdActions(ad, user, { setAd, setError })
  const priceWatch = usePriceWatch(ad)

  const handleReportClick = () => {
    if (actions.handleReport() === true) {
      extras.setReportModalOpen(true)
      extras.setReportReason('')
    }
  }

  const handleReportSubmit = async () => {
    if (!extras.reportReason || !ad) return
    extras.setReportSubmitting(true)
    try {
      await actions.submitReport(ad.id, extras.reportReason)
      extras.setReportModalOpen(false)
      extras.setReportReason('')
    } finally {
      extras.setReportSubmitting(false)
    }
  }

  const handlePhoneClick = () => {
    if (!isAuthenticated) {
      actions.openAuthModal?.()
      return
    }
    extras.setPhoneRevealed(true)
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

  const categoryLabel = extras.categoryName ?? ad.category ?? '—'
  const locationFromDescription = extractLocationFromDescription(ad.description)
  const sellerDisplayName = sellerProfile?.displayName ?? ad.userDisplayName ?? t('ads.seller')
  const sellerAvatar = sellerProfile?.avatar
  const avgRating = reviewsSummary?.averageRating ?? 0
  const totalReviews = reviewsSummary?.totalCount ?? 0
  const ratingText = totalReviews > 0
    ? `${avgRating.toFixed(1)} (${totalReviews})`
    : t('reviews.noReviews')
  const priceInsight = buildPriceInsight(ad, similar?.content, extras.usdToUzs)

  return (
    <div className={`page-container app-page ${styles.widePage}`}>
      {!isMobile && (
        <AdDetailTopBar
          ad={ad}
          categoryLabel={categoryLabel}
          onFavorite={actions.handleFavorite}
          t={t}
        />
      )}

      <div className={styles.mainContent}>
        <div className={styles.threeCol}>
          <div className={styles.leftCol}>
            <div className={styles.leftCard}>
              <AdGallery
                images={ad.images}
                overlay={<PriceInsight insight={priceInsight} t={t} overlay />}
                lightboxFooter={ad.userId ? (
                  <AdGallerySellerFooter
                    ad={ad}
                    sellerDisplayName={sellerDisplayName}
                    sellerAvatar={sellerAvatar}
                    sellerCreatedAt={sellerProfile?.createdAt}
                    phoneRevealed={extras.phoneRevealed}
                    isAuthenticated={isAuthenticated}
                    isOwner={ad.userId === user?.id}
                    chatGoing={actions.chatGoing}
                    lang={lang}
                    t={t}
                    onWriteSeller={actions.handleWriteSeller}
                    onPhoneClick={handlePhoneClick}
                  />
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
                askText={extras.askText}
                onAskChange={extras.setAskText}
                onAskSend={(text) => {
                  actions.handleSendFromAsk?.(text)
                  extras.setAskText('')
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
              <AdDetailMeta
                ad={ad}
                isOwner={ad.userId === user?.id}
                onReport={handleReportClick}
                t={t}
              />
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
                phoneRevealed={extras.phoneRevealed}
                onPhoneClick={handlePhoneClick}
                priceWatching={priceWatch.watching}
                onTrackPrice={priceWatch.toggle}
                onFavorite={isMobile ? actions.handleFavorite : undefined}
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
                  subscribed={extras.sellerSubscribed}
                  isOwner={ad.userId === user?.id}
                  onSubscribe={() => actions.handleSubscribe(extras.setSellerSubscribed)}
                />
              )}
            </div>
          </div>
        </div>

        <SellerAds ads={sellerAds.content} titleKey="ads.sellerAdsTitle" />
        <SimilarAdsSection ads={(similar.content || []).slice(0, 10)} />
      </div>

      <AdReportModal
        open={extras.reportModalOpen}
        reason={extras.reportReason}
        submitting={extras.reportSubmitting}
        onReasonChange={extras.setReportReason}
        onClose={() => extras.setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        t={t}
      />
    </div>
  )
}

import AdsListAdRow from '../AdsListAdRow/AdsListAdRow'
import AdsListRowSkeleton from '../../../../components/ui/AdsListRowSkeleton/AdsListRowSkeleton'
import AdCardSkeletonGrid from '../../../../components/ui/AdCardSkeletonGrid/AdCardSkeletonGrid'
import ContentReveal from '../../../../components/ui/ContentReveal/ContentReveal'
import LoadMoreButton from '../../../../components/ui/LoadMoreButton/LoadMoreButton'
import AdCard from '../AdCard'
import AdCardGrid from '../AdCardGrid'
import { ADS_VIEW } from '../../hooks/useAdsListView'
import styles from './AdsListResults.module.css'

export default function AdsListResults({
  ads,
  data,
  loading,
  loadingMore,
  displayCurrency,
  usdToUzs,
  phoneRevealedIds,
  isAuthenticated,
  userId,
  lang,
  t,
  onFavoriteClick,
  onWriteSeller,
  onShowPhone,
  onLoadMore,
  layout = ADS_VIEW.LIST,
  gridVariant = 'besideNav',
  cardIdPrefix,
  activeAdId,
  onAdHover,
}) {
  const isGrid = layout === ADS_VIEW.GRID

  if (loading && ads.length === 0) {
    if (isGrid) {
      return <AdCardSkeletonGrid count={8} variant={gridVariant} />
    }
    return (
      <ul className={styles.adRowList} aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <AdsListRowSkeleton key={i} />
        ))}
      </ul>
    )
  }

  if (ads.length === 0) {
    return <p className={styles.noAds}>{t('ads.noAds')}</p>
  }

  return (
    <>
      <ContentReveal>
        <div className={`${styles.listWrap} ${loading ? styles.listRefreshing : ''}`} aria-busy={loading || undefined}>
          {isGrid ? (
            <>
              <AdCardGrid variant={gridVariant}>
                {ads.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    t={t}
                    onFavoriteClick={onFavoriteClick}
                    active={activeAdId === ad.id}
                    idPrefix={cardIdPrefix}
                    onHover={onAdHover}
                  />
                ))}
              </AdCardGrid>
              {loadingMore ? <AdCardSkeletonGrid count={4} variant={gridVariant} /> : null}
            </>
          ) : (
            <ul className={styles.adRowList}>
              {ads.map((ad) => (
                <AdsListAdRow
                  key={ad.id}
                  ad={ad}
                  lang={lang}
                  t={t}
                  userId={userId}
                  displayCurrency={displayCurrency}
                  usdToUzs={usdToUzs}
                  phoneRevealed={phoneRevealedIds.has(ad.id)}
                  isAuthenticated={isAuthenticated}
                  onFavoriteClick={onFavoriteClick}
                  onWriteSeller={onWriteSeller}
                  onShowPhone={onShowPhone}
                  active={activeAdId === ad.id}
                  onHover={onAdHover}
                />
              ))}
              {loadingMore
                ? Array.from({ length: 3 }, (_, i) => <AdsListRowSkeleton key={`more-${i}`} />)
                : null}
            </ul>
          )}
        </div>
      </ContentReveal>
      {ads.length > 0 && !data.last && (
        <div className={styles.showMoreWrap}>
          <LoadMoreButton
            className={styles.showMoreBtn}
            loading={loadingMore}
            label={t('common.showMore')}
            onClick={onLoadMore}
            disabled={loading}
            aria-label={t('common.showMore')}
          />
        </div>
      )}
    </>
  )
}

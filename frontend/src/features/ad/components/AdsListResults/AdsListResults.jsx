import AdsListAdRow from '../AdsListAdRow/AdsListAdRow'
import AdsListRowSkeleton from '../../../../components/ui/AdsListRowSkeleton/AdsListRowSkeleton'
import ContentReveal from '../../../../components/ui/ContentReveal/ContentReveal'
import LoadMoreButton from '../../../../components/ui/LoadMoreButton/LoadMoreButton'
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
}) {
  if (loading && ads.length === 0) {
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
              />
            ))}
            {loadingMore
              ? Array.from({ length: 3 }, (_, i) => <AdsListRowSkeleton key={`more-${i}`} />)
              : null}
          </ul>
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

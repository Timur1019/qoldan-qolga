import { useCallback, useEffect, useState } from 'react'
import AdsListMap from '../AdsListMap'
import AdsListResults from '../AdsListResults'
import { ADS_VIEW } from '../../hooks/useAdsListView'
import styles from './AdsListMapView.module.css'

export default function AdsListMapView({
  ads,
  data,
  loading,
  loadingMore,
  regionCode,
  title,
  filterBar,
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
  onClose,
  initialActiveId = null,
}) {
  const [activeId, setActiveId] = useState(initialActiveId)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const handleHover = useCallback((id) => {
    if (id) setActiveId(id)
  }, [])

  const handleSelect = useCallback((id) => {
    setActiveId(id)
    const el = document.getElementById(`ad-map-card-${id}`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [])

  return (
    <div className={styles.overlay}>
      <div className={styles.side}>
        <div className={styles.sideHead}>
          {title ? <h1 className={styles.title}>{title}</h1> : null}
          {filterBar}
        </div>
        <div className={styles.sideBody}>
          <AdsListResults
            layout={ADS_VIEW.GRID}
            gridVariant="cols2"
            cardIdPrefix="ad-map-card-"
            activeAdId={activeId}
            onAdHover={handleHover}
            ads={ads}
            data={data}
            loading={loading}
            loadingMore={loadingMore}
            displayCurrency={displayCurrency}
            usdToUzs={usdToUzs}
            phoneRevealedIds={phoneRevealedIds}
            isAuthenticated={isAuthenticated}
            userId={userId}
            lang={lang}
            t={t}
            onFavoriteClick={onFavoriteClick}
            onWriteSeller={onWriteSeller}
            onShowPhone={onShowPhone}
            onLoadMore={onLoadMore}
          />
        </div>
      </div>
      <div className={styles.mapPane}>
        <AdsListMap
          ads={ads}
          activeId={activeId}
          regionCode={regionCode}
          onHover={handleHover}
          onSelect={handleSelect}
        />
        <button type="button" className={styles.listBtn} onClick={onClose}>
          <i className="bi bi-list-ul" aria-hidden />
          {t('ads.showAsList')}
        </button>
      </div>
    </div>
  )
}

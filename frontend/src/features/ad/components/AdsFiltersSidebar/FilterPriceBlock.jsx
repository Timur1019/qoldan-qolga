import styles from './AdsFiltersSidebar.module.css'

export default function FilterPriceBlock({
  priceFrom,
  priceTo,
  setFilterDraft,
  t,
}) {
  return (
    <div className={styles.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{t('ads.price')}</p>
      <div className="row g-2">
        <div className="col-6">
          <input
            type="number"
            min="0"
            step="1"
            value={priceFrom}
            onChange={(e) => setFilterDraft((d) => ({ ...d, priceFrom: e.target.value }))}
            className="form-control form-control-sm"
            placeholder={t('ads.priceFrom')}
          />
        </div>
        <div className="col-6">
          <input
            type="number"
            min="0"
            step="1"
            value={priceTo}
            onChange={(e) => setFilterDraft((d) => ({ ...d, priceTo: e.target.value }))}
            className="form-control form-control-sm"
            placeholder={t('ads.priceTo')}
          />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import AdsFiltersDrawerTransport from './AdsFiltersDrawerTransport'
import AdsFiltersDrawerRealEstate from './AdsFiltersDrawerRealEstate'
import AdsFiltersDrawerBrand from './AdsFiltersDrawerBrand'
import { sellerTypeOptionsForCategory } from '../../../../constants/sellerTypes'
import styles from './AdsFilterBar.module.css'

export default function AdsFiltersDrawer({
  open,
  onClose,
  filters,
  onApply,
  onReset,
  t,
  lang,
  transportFlags = {},
  realEstateFlags = {},
  brands = [],
  isClothingCategory = false,
  filterFlags = {},
}) {
  if (!open) return null

  return (
    <DrawerBody
      key={[
        filters.category,
        filters.currency,
        filters.brandId,
        filters.modelId,
        (filters.itemCondition || []).join(','),
        (filters.sellerType || []).join(','),
        filters.priceFrom,
        filters.priceTo,
        filters.urgentBargain,
        filters.canDeliver,
        filters.giveAway,
        (filters.dealType || []).join(','),
        (filters.rooms || []).join(','),
      ].join('|')}
      filters={filters}
      onClose={onClose}
      onApply={onApply}
      onReset={onReset}
      t={t}
      lang={lang}
      transportFlags={transportFlags}
      realEstateFlags={realEstateFlags}
      brands={brands}
      isClothingCategory={isClothingCategory}
      filterFlags={filterFlags}
    />
  )
}

function DrawerBody({ filters, onClose, onApply, onReset, t, lang, transportFlags, realEstateFlags, brands, isClothingCategory, filterFlags }) {
  const [draft, setDraft] = useState(filters)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const toggleCondition = (val) => {
    setDraft((d) => {
      const arr = (d.itemCondition || []).map(String)
      const key = String(val)
      const i = arr.indexOf(key)
      if (i >= 0) arr.splice(i, 1)
      else arr.push(key)
      return { ...d, itemCondition: arr }
    })
  }

  const toggleSeller = (val) => {
    setDraft((d) => {
      const arr = (d.sellerType || []).map(String)
      const key = String(val)
      const i = arr.indexOf(key)
      if (i >= 0) arr.splice(i, 1)
      else arr.push(key)
      return { ...d, sellerType: arr }
    })
  }

  const conditionOptions = isClothingCategory
    ? [
        { value: 'USED_LIKE_NEW', label: t('ads.conditionUsedLikeNew') },
        { value: 'USED_GOOD', label: t('ads.conditionUsedGood') },
        { value: 'USED_FAIR', label: t('ads.conditionUsedFair') },
        { value: 'NEW', label: t('ads.conditionNew') },
      ]
    : filterFlags.handmade === false
      ? [
          { value: 'USED', label: t('ads.conditionUsed') },
          { value: 'NEW', label: t('ads.conditionNew') },
        ]
      : [
          { value: 'USED', label: t('ads.conditionUsed') },
          { value: 'NEW', label: t('ads.conditionNew') },
          { value: 'HANDMADE', label: t('ads.conditionHandmade') },
        ]
  const sellerOptions = sellerTypeOptionsForCategory(filters.category).map((o) => ({
    value: o.value,
    label: t(o.labelKey),
  }))
  const currencyOptions = [
    { value: 'FROM_AD', label: t('ads.currencyFromAd') },
    { value: 'UZS', label: t('ads.currencyUzs') },
    { value: 'USD', label: t('ads.currencyCu') },
  ]

  return (
    <div className={styles.drawerOverlay} onClick={onClose} role="presentation">
      <aside
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('ads.filters')}
      >
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>{t('ads.filters')}</h2>
          <button type="button" className={styles.drawerClose} onClick={onClose} aria-label={t('common.close')}>
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        <div className={styles.drawerBody}>
          <AdsFiltersDrawerTransport
            flags={transportFlags}
            draft={draft}
            setDraft={setDraft}
            brands={brands}
            lang={lang}
            t={t}
          />
          <AdsFiltersDrawerRealEstate
            flags={realEstateFlags}
            draft={draft}
            setDraft={setDraft}
            t={t}
          />
          {!transportFlags.brand && !realEstateFlags.realEstate && (
            <AdsFiltersDrawerBrand
              brands={brands}
              draft={draft}
              setDraft={setDraft}
              transport={false}
              lang={lang}
              t={t}
            />
          )}
          {filterFlags.condition !== false && (
          <div className={styles.drawerBlock}>
            <p className={styles.drawerBlockTitle}>{t('ads.conditionLabel')}</p>
            {conditionOptions.map((o) => (
              <label key={o.value} className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={(draft.itemCondition || []).map(String).includes(o.value)}
                  onChange={() => toggleCondition(o.value)}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          )}
          <div className={styles.drawerBlock}>
            <p className={styles.drawerBlockTitle}>{t('ads.sellerType')}</p>
            {sellerOptions.map((o) => (
              <label key={o.value} className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={(draft.sellerType || []).map(String).includes(o.value)}
                  onChange={() => toggleSeller(o.value)}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
          <div className={styles.drawerBlock}>
            <p className={styles.drawerBlockTitle}>{t('ads.currency')}</p>
            {currencyOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                className={styles.radioRow}
                onClick={() => setDraft((d) => ({ ...d, currency: o.value }))}
              >
                <span>{o.label}</span>
                <span className={`${styles.radio} ${(draft.currency || 'FROM_AD') === o.value ? styles.radioOn : ''}`} />
              </button>
            ))}
          </div>
          <div className={styles.drawerBlock}>
            <p className={styles.drawerBlockTitle}>{t('ads.price')}</p>
            <div className={styles.priceRow}>
              <input
                type="number"
                min="0"
                className={styles.priceInput}
                placeholder={t('ads.priceFrom')}
                value={draft.priceFrom || ''}
                onChange={(e) => setDraft((d) => ({ ...d, priceFrom: e.target.value }))}
              />
              <span className={styles.priceDash}>—</span>
              <input
                type="number"
                min="0"
                className={styles.priceInput}
                placeholder={t('ads.priceTo')}
                value={draft.priceTo || ''}
                onChange={(e) => setDraft((d) => ({ ...d, priceTo: e.target.value }))}
              />
            </div>
          </div>
          {(filterFlags.urgentBargain !== false || filterFlags.canDeliver !== false || filterFlags.giveAway !== false) && (
          <div className={styles.drawerBlock}>
            <p className={styles.drawerBlockTitle}>{t('ads.extra')}</p>
            {filterFlags.urgentBargain !== false && (
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={!!draft.urgentBargain}
                  onChange={() => setDraft((d) => ({ ...d, urgentBargain: !d.urgentBargain }))}
                />
                <span>{t('ads.urgentBargain')}</span>
              </label>
            )}
            {filterFlags.canDeliver !== false && (
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={!!draft.canDeliver}
                  onChange={() => setDraft((d) => ({ ...d, canDeliver: !d.canDeliver }))}
                />
                <span>{t('ads.courierDelivery')}</span>
              </label>
            )}
            {filterFlags.giveAway !== false && (
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={!!draft.giveAway}
                  onChange={() => setDraft((d) => ({ ...d, giveAway: !d.giveAway }))}
                />
                <span>{t('ads.giveAway')}</span>
              </label>
            )}
          </div>
          )}
        </div>
        <div className={styles.drawerFooter}>
          <button
            type="button"
            className={styles.drawerApply}
            onClick={() => {
              onApply(draft)
              onClose?.()
            }}
          >
            {t('ads.applyFilters')}
          </button>
          <button
            type="button"
            className={styles.drawerReset}
            onClick={() => {
              onReset?.()
              onClose?.()
            }}
          >
            {t('ads.reset')}
          </button>
        </div>
      </aside>
    </div>
  )
}

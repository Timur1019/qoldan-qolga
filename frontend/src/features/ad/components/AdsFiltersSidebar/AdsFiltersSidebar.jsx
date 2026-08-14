import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import TransportSidebarFields from './TransportSidebarFields'
import RealEstateSidebarFields from './RealEstateSidebarFields'
import { sellerTypeOptionsForCategory } from '../../../../constants/sellerTypes'
import styles from './AdsFiltersSidebar.module.css'

/** Блок фильтра с чекбоксами: можно выбрать несколько значений одновременно. */
function FilterCheckboxBlock({
  title,
  options,
  value,
  fieldKey,
  idPrefix,
  setFilterDraft,
}) {
  const selected = Array.isArray(value) ? value.map(String) : []
  const toggle = (optVal) => {
    const key = String(optVal)
    setFilterDraft((d) => {
      const raw = Array.isArray(d[fieldKey]) ? d[fieldKey] : []
      const arr = raw.map(String)
      const idx = arr.indexOf(key)
      if (idx >= 0) arr.splice(idx, 1)
      else arr.push(key)
      return { ...d, [fieldKey]: arr }
    })
  }
  return (
    <div className={styles.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{title}</p>
      <div className={styles.checkList}>
        {options.map(({ value: optVal, label }) => {
          const id = `${idPrefix}-${String(optVal)}`
          const isChecked = selected.includes(String(optVal))
          return (
            <label key={id} className={styles.checkRow} htmlFor={id}>
              <input
                type="checkbox"
                id={id}
                checked={isChecked}
                onChange={() => toggle(optVal)}
                className={styles.checkInput}
              />
              <span className={styles.checkLabel}>{label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/** Да/Нет: внутри пары взаимоисключающие; между разными блоками — независимо. */
function FilterYesNoCheckboxes({
  title,
  fieldKey,
  value,
  setFilterDraft,
  idPrefix,
  yesLabel,
  noLabel,
}) {
  const normalized = (value === true || value === 'true') ? true : (value === false || value === 'false') ? false : ''
  return (
    <div className={styles.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{title}</p>
      <div className={styles.checkList}>
        <label className={styles.checkRow} htmlFor={`${idPrefix}-yes`}>
          <input
            type="checkbox"
            id={`${idPrefix}-yes`}
            checked={normalized === true}
            onChange={() => setFilterDraft((d) => ({ ...d, [fieldKey]: normalized === true ? '' : true }))}
            className={styles.checkInput}
          />
          <span className={styles.checkLabel}>{yesLabel}</span>
        </label>
        <label className={styles.checkRow} htmlFor={`${idPrefix}-no`}>
          <input
            type="checkbox"
            id={`${idPrefix}-no`}
            checked={normalized === false}
            onChange={() => setFilterDraft((d) => ({ ...d, [fieldKey]: normalized === false ? '' : false }))}
            className={styles.checkInput}
          />
          <span className={styles.checkLabel}>{noLabel}</span>
        </label>
      </div>
    </div>
  )
}

export default function AdsFiltersSidebar({
  regions = [],
  sidebarCategories = [],
  currentCategoryCode = '',
  sidebarTitle,
  filterDraft,
  setFilterDraft,
  onCurrencyChange,
  onApply,
  onReset,
  buildCategoryLink,
  buildAdsLink,
  brands = [],
  isClothingCategory = false,
  transportFlags = {},
  realEstateFlags = {},
  filterFlags = {},
  t,
  lang,
}) {
  const [expanded, setExpanded] = useState(false)
  const [brandBlockCollapsed, setBrandBlockCollapsed] = useState(false)
  const [brandSearch, setBrandSearch] = useState('')
  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const title = sidebarTitle ?? t('nav.services')
  const filteredBrands = useMemo(() => {
    const q = (brandSearch || '').trim().toLowerCase()
    if (!q) return brands
    return brands.filter((b) =>
      (b.nameRu || '').toLowerCase().includes(q) || (b.nameUz || '').toLowerCase().includes(q)
    )
  }, [brands, brandSearch])
  const hasMore = sidebarCategories.length > 8
  const displayCategories = hasMore && !expanded
    ? sidebarCategories.slice(0, 8)
    : sidebarCategories

  const conditionOptions = useMemo(
    () =>
      isClothingCategory
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
            ],
    [isClothingCategory, filterFlags.handmade, t]
  )
  const sellerTypeOptions = useMemo(
    () =>
      sellerTypeOptionsForCategory(currentCategoryCode).map((o) => ({
        value: o.value,
        label: t(o.labelKey),
      })),
    [currentCategoryCode, t]
  )
  const yesLabel = lang === 'ru' ? 'Да' : 'Ha'
  const noLabel = lang === 'ru' ? 'Нет' : "Yo'q"

  return (
    <aside className={`app-card ${styles.sidebar}`}>
      <h2 className={`h6 mb-3 ${styles.sidebarTitle}`}>
        {currentCategoryCode ? <CategoryIcon code={currentCategoryCode} className={styles.sidebarTitleIcon} /> : null}
        <span>{title}</span>
      </h2>
      <div className={styles.sidebarBlock}>
        <p className="small fw-semibold text-secondary mb-2">{t('ads.adsInUzbekistan')}</p>
        <ul className="list-unstyled mb-0">
          {displayCategories.map((c) => {
            const code = c.code ?? c.id
            if (!code) return null
            const isActive = String(code) === String(currentCategoryCode)
            return (
              <li key={code}>
                <Link
                  to={buildAdsLink(code)}
                  className={`${styles.sidebarCatItem} ${isActive ? styles.sidebarCatItemActive : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.sidebarCatMain}>
                    <CategoryIcon code={code} parentCode={c.parentCode} className={styles.sidebarCatIcon} />
                    <span>{categoryName(c)}</span>
                  </span>
                  <i className="bi bi-chevron-right small" aria-hidden />
                </Link>
              </li>
            )
          })}
          {hasMore && (
            <li>
              <button
                type="button"
                className="btn btn-link p-0 small text-primary text-decoration-none"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
              >
                {expanded ? `${t('ads.showLess')} ↑` : `${t('ads.showAll')} ↓`}
              </button>
            </li>
          )}
        </ul>
      </div>
      <div className={styles.sidebarBlock}>
        <label className="form-label small fw-semibold text-secondary">{t('ads.region')}</label>
        <select
          value={filterDraft.region || ''}
          onChange={(e) => setFilterDraft((d) => ({ ...d, region: e.target.value }))}
          className="form-select form-select-sm"
        >
          <option value="">— {t('ads.allRegions')}</option>
          {regions.map((r) => (
            <option key={r.code} value={r.code}>
              {lang === 'ru' ? r.nameRu : r.nameUz}
            </option>
          ))}
        </select>
      </div>

      {filterFlags.condition !== false && (
        <FilterCheckboxBlock
          title={t('ads.conditionLabel')}
          options={conditionOptions}
          value={filterDraft.itemCondition}
          fieldKey="itemCondition"
          idPrefix="itemCondition"
          setFilterDraft={setFilterDraft}
        />
      )}

      {filterFlags.canRent && (
        <FilterYesNoCheckboxes
          title={t('ads.canRentLabel')}
          fieldKey="canRent"
          value={filterDraft.canRent}
          setFilterDraft={setFilterDraft}
          idPrefix="canRent"
          yesLabel={t('ads.canRentYes')}
          noLabel={t('ads.canRentNo')}
        />
      )}

      {filterFlags.handmade !== false && (
        <FilterYesNoCheckboxes
          title={t('ads.handMadeLabel')}
          fieldKey="handMadeOnly"
          value={filterDraft.handMadeOnly}
          setFilterDraft={setFilterDraft}
          idPrefix="handMadeOnly"
          yesLabel={t('ads.handMadeYes')}
          noLabel={t('ads.handMadeNo')}
        />
      )}

      {brands.length > 0 && !realEstateFlags.realEstate && !transportFlags.brand && (
        <div className={`${styles.sidebarBlock} ${styles.brandBlock}`}>
          <p className="small fw-semibold text-secondary mb-2">{lang === 'ru' ? 'Производитель' : 'Ishlab chiqaruvchi'}</p>
          {!brandBlockCollapsed && (
            <>
              <div className="input-group input-group-sm mb-2">
                <span className="input-group-text bg-light border-end-0" id="brand-search-icon">
                  <i className="bi bi-search text-muted" aria-hidden />
                </span>
                <input
                  type="search"
                  placeholder={lang === 'ru' ? 'Введите название бренда' : 'Brend nomini kiriting'}
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="form-control border-start-0"
                  aria-label={lang === 'ru' ? 'Поиск бренда' : 'Brend qidirish'}
                />
              </div>
              <div className={styles.brandList}>
                {filteredBrands.map((b) => {
                  const isChecked = (filterDraft.brandId || '') === b.id
                  return (
                    <label key={b.id} className={styles.checkRow} htmlFor={`brand-${b.id}`}>
                      <input
                        type="checkbox"
                        className={styles.checkInput}
                        id={`brand-${b.id}`}
                        checked={isChecked}
                        onChange={() => {
                          setFilterDraft((d) => ({ ...d, brandId: isChecked ? '' : b.id, modelId: '' }))
                        }}
                      />
                      <span className={styles.checkLabel}>{lang === 'ru' ? b.nameRu : b.nameUz}</span>
                    </label>
                  )
                })}
              </div>
            </>
          )}
          <button
            type="button"
            className="btn btn-link p-0 small text-primary text-decoration-none mt-1"
            onClick={() => setBrandBlockCollapsed((c) => !c)}
            aria-expanded={!brandBlockCollapsed}
          >
            {brandBlockCollapsed ? (lang === 'ru' ? 'Развернуть' : 'Yoyish') : (lang === 'ru' ? 'Свернуть' : "Yig'ish")}
            <i className={`bi ms-1 ${brandBlockCollapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`} aria-hidden />
          </button>
        </div>
      )}

      <TransportSidebarFields
        flags={transportFlags}
        filterDraft={filterDraft}
        setFilterDraft={setFilterDraft}
        brands={brands}
        t={t}
        lang={lang}
      />

      <RealEstateSidebarFields
        flags={realEstateFlags}
        filterDraft={filterDraft}
        setFilterDraft={setFilterDraft}
        t={t}
      />

      <FilterCheckboxBlock
        title={t('ads.sellerType')}
        options={sellerTypeOptions}
        value={filterDraft.sellerType}
        fieldKey="sellerType"
        idPrefix="sellerType"
        setFilterDraft={setFilterDraft}
      />

      {filterFlags.license && (
        <FilterYesNoCheckboxes
          title={t('ads.hasLicense')}
          fieldKey="hasLicense"
          value={filterDraft.hasLicense}
          setFilterDraft={setFilterDraft}
          idPrefix="hasLicense"
          yesLabel={yesLabel}
          noLabel={noLabel}
        />
      )}

      {filterFlags.contract && (
        <FilterYesNoCheckboxes
          title={t('ads.worksByContract')}
          fieldKey="worksByContract"
          value={filterDraft.worksByContract}
          setFilterDraft={setFilterDraft}
          idPrefix="worksByContract"
          yesLabel={yesLabel}
          noLabel={noLabel}
        />
      )}

      <div className={styles.sidebarBlock}>
        <p className="small fw-semibold text-secondary mb-2">{t('ads.currency')}</p>
        <div className="btn-group btn-group-sm w-100" role="group">
          {[
            { value: 'FROM_AD', label: t('ads.currencyFromAd') },
            { value: 'UZS', label: t('ads.currencyUzs') },
            { value: 'USD', label: t('ads.currencyCu') },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`btn ${filterDraft.currency === value || (value === 'FROM_AD' && (!filterDraft.currency || filterDraft.currency === 'FROM_AD')) ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => {
                if (typeof onCurrencyChange === 'function') {
                  onCurrencyChange(value)
                } else {
                  setFilterDraft((d) => ({ ...d, currency: value }))
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.sidebarBlock}>
        <p className="small fw-semibold text-secondary mb-2">{t('ads.price')}</p>
        <div className="row g-2">
          <div className="col-6">
            <input
              type="number"
              min="0"
              step="1"
              value={filterDraft.priceFrom}
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
              value={filterDraft.priceTo}
              onChange={(e) => setFilterDraft((d) => ({ ...d, priceTo: e.target.value }))}
              className="form-control form-control-sm"
              placeholder={t('ads.priceTo')}
            />
          </div>
        </div>
      </div>

      {(filterFlags.urgentBargain !== false || filterFlags.canDeliver !== false || filterFlags.giveAway !== false) && (
      <div className={styles.sidebarBlock}>
        <p className={styles.sidebarBlockTitle}>{t('ads.additionally')}</p>
        <div className={styles.filterToggles}>
          {filterFlags.urgentBargain !== false && (
            <div className={styles.filterToggleRow}>
              <span>{t('ads.urgentBargain')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={filterDraft.urgentBargain}
                className={`${styles.filterToggle} ${filterDraft.urgentBargain ? styles.filterToggleOn : ''}`}
                onClick={() => setFilterDraft((d) => ({ ...d, urgentBargain: !d.urgentBargain }))}
              >
                <span className={styles.filterToggleKnob} />
              </button>
            </div>
          )}
          {filterFlags.canDeliver !== false && (
            <div className={styles.filterToggleRow}>
              <span>{t('ads.courierDelivery')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={filterDraft.canDeliver}
                className={`${styles.filterToggle} ${filterDraft.canDeliver ? styles.filterToggleOn : ''}`}
                onClick={() => setFilterDraft((d) => ({ ...d, canDeliver: !d.canDeliver }))}
              >
                <span className={styles.filterToggleKnob} />
              </button>
            </div>
          )}
          {filterFlags.giveAway !== false && (
            <div className={styles.filterToggleRow}>
              <span>{t('ads.giveAway')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={filterDraft.giveAway}
                className={`${styles.filterToggle} ${filterDraft.giveAway ? styles.filterToggleOn : ''}`}
                onClick={() => setFilterDraft((d) => ({ ...d, giveAway: !d.giveAway }))}
              >
                <span className={styles.filterToggleKnob} />
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      <div className="d-flex gap-2 mt-3">
        <button type="button" className="btn btn-outline-secondary btn-sm flex-grow-1" onClick={onReset}>
          {t('ads.reset')}
        </button>
        <button type="button" className="btn btn-primary btn-sm flex-grow-1" onClick={onApply}>
          {t('ads.apply')}
        </button>
      </div>
    </aside>
  )
}

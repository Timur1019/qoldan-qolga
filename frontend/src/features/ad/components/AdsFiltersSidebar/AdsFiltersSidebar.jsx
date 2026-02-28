import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './AdsFiltersSidebar.module.css'

export default function AdsFiltersSidebar({
  regions = [],
  sidebarCategories = [],
  currentCategoryCode = '',
  filterDraft,
  setFilterDraft,
  region,
  setRegion,
  onApply,
  onReset,
  buildCategoryLink,
  buildAdsLink,
  t,
  lang,
}) {
  const [expanded, setExpanded] = useState(false)
  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const hasMore = sidebarCategories.length > 8
  const displayCategories = hasMore && !expanded
    ? sidebarCategories.slice(0, 8)
    : sidebarCategories

  return (
    <aside className={`app-card ${styles.sidebar}`}>
      <h2 className="h6 mb-3">{t('nav.services')}</h2>
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
                  {categoryName(c)} <i className="bi bi-chevron-right small" aria-hidden />
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
          value={region}
          onChange={(e) => setRegion(e.target.value)}
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

      <div className={styles.sidebarBlock}>
        <p className="small fw-semibold text-secondary mb-2">{t('ads.sellerType')}</p>
        <div className="d-flex flex-column gap-1">
          {[
            { value: '', label: t('ads.any') },
            { value: 'PRIVATE', label: t('ads.sellerPrivate') },
            { value: 'BUSINESS', label: t('ads.sellerBusiness') },
          ].map(({ value, label }) => (
            <div key={value || 'any'} className="form-check">
              <input
                type="radio"
                name="sellerType"
                id={`sellerType-${value || 'any'}`}
                checked={filterDraft.sellerType === value}
                onChange={() => setFilterDraft((d) => ({ ...d, sellerType: value }))}
                className="form-check-input"
              />
              <label className="form-check-label small" htmlFor={`sellerType-${value || 'any'}`}>{label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sidebarBlock}>
        <p className="small fw-semibold text-secondary mb-2">{t('ads.hasLicense')}</p>
        <div className="d-flex flex-column gap-1">
          {[
            { value: '', label: t('ads.any') },
            { value: 'false', label: lang === 'ru' ? 'Нет' : 'Yo\'q' },
            { value: 'true', label: lang === 'ru' ? 'Да' : 'Ha' },
          ].map(({ value, label }) => (
            <div key={value || 'any'} className="form-check">
              <input
                type="radio"
                name="hasLicense"
                id={`hasLicense-${value || 'any'}`}
                checked={filterDraft.hasLicense === value}
                onChange={() => setFilterDraft((d) => ({ ...d, hasLicense: value }))}
                className="form-check-input"
              />
              <label className="form-check-label small" htmlFor={`hasLicense-${value || 'any'}`}>{label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sidebarBlock}>
        <p className="small fw-semibold text-secondary mb-2">{t('ads.worksByContract')}</p>
        <div className="d-flex flex-column gap-1">
          {[
            { value: '', label: t('ads.any') },
            { value: 'false', label: lang === 'ru' ? 'Нет' : 'Yo\'q' },
            { value: 'true', label: lang === 'ru' ? 'Да' : 'Ha' },
          ].map(({ value, label }) => (
            <div key={value || 'any'} className="form-check">
              <input
                type="radio"
                name="worksByContract"
                id={`worksByContract-${value || 'any'}`}
                checked={filterDraft.worksByContract === value}
                onChange={() => setFilterDraft((d) => ({ ...d, worksByContract: value }))}
                className="form-check-input"
              />
              <label className="form-check-label small" htmlFor={`worksByContract-${value || 'any'}`}>{label}</label>
            </div>
          ))}
        </div>
      </div>

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
              onClick={() => setFilterDraft((d) => ({ ...d, currency: value }))}
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

      <div className={styles.sidebarBlock}>
        <p className={styles.sidebarBlockTitle}>{t('ads.additionally')}</p>
        <div className={styles.filterToggles}>
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
        </div>
      </div>

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

import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './AdsFiltersSidebar.module.css'

export default function AdsFiltersSidebar({
  regions = [],
  sidebarCategories = [],
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
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>{t('nav.services')}</h2>
      <div className={styles.sidebarBlock}>
        <p className={styles.sidebarBlockTitle}>{t('ads.adsInUzbekistan')}</p>
        <ul className={styles.sidebarCatList}>
          {displayCategories.map((c) => (
            <li key={c.code}>
              <Link
                to={c.hasChildren ? buildCategoryLink(c.code) : buildAdsLink(c.code)}
                className={styles.sidebarCatItem}
              >
                {categoryName(c)}
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
          {hasMore && (
            <li>
              <button
                type="button"
                className={styles.sidebarCatMore}
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
        <p className={styles.sidebarBlockTitle}>{t('ads.region')}</p>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={styles.sidebarSelect}
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
        <p className={styles.sidebarBlockTitle}>{t('ads.sellerType')}</p>
        <div className={styles.filterRadioGroup}>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="sellerType"
              checked={filterDraft.sellerType === ''}
              onChange={() => setFilterDraft((d) => ({ ...d, sellerType: '' }))}
            />
            <span>{t('ads.any')}</span>
          </label>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="sellerType"
              checked={filterDraft.sellerType === 'PRIVATE'}
              onChange={() => setFilterDraft((d) => ({ ...d, sellerType: 'PRIVATE' }))}
            />
            <span>{t('ads.sellerPrivate')}</span>
          </label>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="sellerType"
              checked={filterDraft.sellerType === 'BUSINESS'}
              onChange={() => setFilterDraft((d) => ({ ...d, sellerType: 'BUSINESS' }))}
            />
            <span>{t('ads.sellerBusiness')}</span>
          </label>
        </div>
      </div>

      <div className={styles.sidebarBlock}>
        <p className={styles.sidebarBlockTitle}>{t('ads.hasLicense')}</p>
        <div className={styles.filterRadioGroup}>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="hasLicense"
              checked={filterDraft.hasLicense === ''}
              onChange={() => setFilterDraft((d) => ({ ...d, hasLicense: '' }))}
            />
            <span>{t('ads.any')}</span>
          </label>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="hasLicense"
              checked={filterDraft.hasLicense === 'false'}
              onChange={() => setFilterDraft((d) => ({ ...d, hasLicense: 'false' }))}
            />
            <span>{lang === 'ru' ? 'Нет' : 'Yo\'q'}</span>
          </label>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="hasLicense"
              checked={filterDraft.hasLicense === 'true'}
              onChange={() => setFilterDraft((d) => ({ ...d, hasLicense: 'true' }))}
            />
            <span>{lang === 'ru' ? 'Да' : 'Ha'}</span>
          </label>
        </div>
      </div>

      <div className={styles.sidebarBlock}>
        <p className={styles.sidebarBlockTitle}>{t('ads.worksByContract')}</p>
        <div className={styles.filterRadioGroup}>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="worksByContract"
              checked={filterDraft.worksByContract === ''}
              onChange={() => setFilterDraft((d) => ({ ...d, worksByContract: '' }))}
            />
            <span>{t('ads.any')}</span>
          </label>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="worksByContract"
              checked={filterDraft.worksByContract === 'false'}
              onChange={() => setFilterDraft((d) => ({ ...d, worksByContract: 'false' }))}
            />
            <span>{lang === 'ru' ? 'Нет' : 'Yo\'q'}</span>
          </label>
          <label className={styles.filterRadio}>
            <input
              type="radio"
              name="worksByContract"
              checked={filterDraft.worksByContract === 'true'}
              onChange={() => setFilterDraft((d) => ({ ...d, worksByContract: 'true' }))}
            />
            <span>{lang === 'ru' ? 'Да' : 'Ha'}</span>
          </label>
        </div>
      </div>

      <div className={styles.sidebarBlock}>
        <p className={styles.sidebarBlockTitle}>{t('ads.currency')}</p>
        <div className={styles.filterCurrencyBtns}>
          <button
            type="button"
            className={`${styles.filterCurrencyBtn} ${filterDraft.currency === 'FROM_AD' || !filterDraft.currency ? styles.filterCurrencyBtnActive : ''}`}
            onClick={() => setFilterDraft((d) => ({ ...d, currency: 'FROM_AD' }))}
          >
            {t('ads.currencyFromAd')}
          </button>
          <button
            type="button"
            className={`${styles.filterCurrencyBtn} ${filterDraft.currency === 'UZS' ? styles.filterCurrencyBtnActive : ''}`}
            onClick={() => setFilterDraft((d) => ({ ...d, currency: 'UZS' }))}
          >
            {t('ads.currencyUzs')}
          </button>
          <button
            type="button"
            className={`${styles.filterCurrencyBtn} ${filterDraft.currency === 'USD' ? styles.filterCurrencyBtnActive : ''}`}
            onClick={() => setFilterDraft((d) => ({ ...d, currency: 'USD' }))}
          >
            {t('ads.currencyCu')}
          </button>
        </div>
      </div>

      <div className={styles.sidebarBlock}>
        <p className={styles.sidebarBlockTitle}>{t('ads.price')}</p>
        <div className={styles.filterPriceRow}>
          <input
            type="number"
            min="0"
            step="1"
            value={filterDraft.priceFrom}
            onChange={(e) => setFilterDraft((d) => ({ ...d, priceFrom: e.target.value }))}
            className={styles.filterPriceInput}
            placeholder={t('ads.priceFrom')}
          />
          <input
            type="number"
            min="0"
            step="1"
            value={filterDraft.priceTo}
            onChange={(e) => setFilterDraft((d) => ({ ...d, priceTo: e.target.value }))}
            className={styles.filterPriceInput}
            placeholder={t('ads.priceTo')}
          />
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

      <div className={styles.sidebarActions}>
        <button type="button" className={styles.sidebarBtnReset} onClick={onReset}>
          {t('ads.reset')}
        </button>
        <button type="button" className={styles.sidebarBtnApply} onClick={onApply}>
          {t('ads.apply')}
        </button>
      </div>
    </aside>
  )
}

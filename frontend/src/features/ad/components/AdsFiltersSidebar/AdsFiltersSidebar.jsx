import { useState, useMemo } from 'react'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import TransportSidebarFields from './TransportSidebarFields'
import RealEstateSidebarFields from './RealEstateSidebarFields'
import FilterCheckboxBlock from './FilterCheckboxBlock'
import FilterYesNoCheckboxes from './FilterYesNoCheckboxes'
import FilterCategoryList from './FilterCategoryList'
import FilterBrandBlock from './FilterBrandBlock'
import FilterRegionBlock from './FilterRegionBlock'
import FilterCurrencyBlock from './FilterCurrencyBlock'
import FilterPriceBlock from './FilterPriceBlock'
import FilterExtraToggles from './FilterExtraToggles'
import { sellerTypeOptionsForCategory } from '../../../../constants/sellerTypes'
import styles from './AdsFiltersSidebar.module.css'

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
  const categoryName = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const title = sidebarTitle ?? t('nav.services')
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
      <FilterCategoryList
        sidebarCategories={sidebarCategories}
        currentCategoryCode={currentCategoryCode}
        buildAdsLink={buildAdsLink}
        expanded={expanded}
        onToggleExpanded={() => setExpanded((e) => !e)}
        categoryName={categoryName}
        t={t}
      />
      <FilterRegionBlock
        regions={regions}
        region={filterDraft.region}
        setFilterDraft={setFilterDraft}
        t={t}
        lang={lang}
      />

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
        <FilterBrandBlock
          brands={brands}
          brandId={filterDraft.brandId}
          setFilterDraft={setFilterDraft}
          lang={lang}
        />
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

      <FilterCurrencyBlock
        currency={filterDraft.currency}
        setFilterDraft={setFilterDraft}
        onCurrencyChange={onCurrencyChange}
        t={t}
      />
      <FilterPriceBlock
        priceFrom={filterDraft.priceFrom}
        priceTo={filterDraft.priceTo}
        setFilterDraft={setFilterDraft}
        t={t}
      />
      <FilterExtraToggles
        filterFlags={filterFlags}
        filterDraft={filterDraft}
        setFilterDraft={setFilterDraft}
        t={t}
      />

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

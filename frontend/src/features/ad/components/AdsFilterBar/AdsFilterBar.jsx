import { useMemo, useState } from 'react'
import FilterChip from './FilterChip'
import FilterPopover from './FilterPopover'
import CategoryFilterPanel from './panels/CategoryFilterPanel'
import ConditionFilterPanel from './panels/ConditionFilterPanel'
import SellerFilterPanel from './panels/SellerFilterPanel'
import CurrencyFilterPanel from './panels/CurrencyFilterPanel'
import PriceFilterPanel from './panels/PriceFilterPanel'
import AdsFiltersDrawer from './AdsFiltersDrawer'
import AdsFilterBarTransportChips from './AdsFilterBarTransportChips'
import AdsFilterBarRealEstateChips from './AdsFilterBarRealEstateChips'
import AdsFilterBarBrandChip from './AdsFilterBarBrandChip'
import AdsSortMenu from './AdsSortMenu'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import { sellerTypeOptionsForCategory } from '../../../../constants/sellerTypes'
import styles from './AdsFilterBar.module.css'

const POP = {
  CATEGORY: 'category',
  CONDITION: 'condition',
  SELLER: 'seller',
  CURRENCY: 'currency',
  PRICE: 'price',
}

export default function AdsFilterBar({
  filters,
  patchFilters,
  setCurrency,
  setSort,
  toggleFlag,
  clearFilterKeys,
  resetAllFilters,
  categoryName,
  lang,
  t,
  isClothingCategory = false,
  transportFlags = {},
  realEstateFlags = {},
  filterFlags = {},
  brands = [],
  showSort = true,
  endSlot = null,
  compact = false,
}) {
  const [openPop, setOpenPop] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const closePop = () => setOpenPop(null)
  const togglePop = (id) => setOpenPop((cur) => (cur === id ? null : id))

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

  const sellerOptions = useMemo(
    () =>
      sellerTypeOptionsForCategory(filters.category).map((o) => ({
        value: o.value,
        label: t(o.labelKey),
      })),
    [filters.category, t]
  )

  const hasCondition = (filters.itemCondition || []).length > 0
  const hasSeller = (filters.sellerType || []).length > 0
  const hasPrice = Boolean(filters.priceFrom || filters.priceTo)
  const hasCurrency = filters.currency && filters.currency !== 'FROM_AD'
  const hasCategory = Boolean(filters.category)

  const categoryChipLabel = hasCategory && categoryName
    ? categoryName
    : t('ads.filterCategory')

  return (
    <div className={styles.toolbar}>
      <div className={`${styles.bar} ${styles.toolbarMain}`}>
        <div className={styles.chipSlot}>
          <FilterChip
            label={t('ads.filters')}
            icon={<i className="bi bi-sliders" />}
            active={false}
            open={drawerOpen}
            onClick={() => {
              closePop()
              setDrawerOpen(true)
            }}
          />
        </div>

        {!compact && (
        <>
        <div className={styles.chipSlot}>
          <FilterChip
            label={categoryChipLabel}
            icon={<CategoryIcon code={hasCategory ? filters.category : ''} fallback="grid" />}
            active={hasCategory}
            open={openPop === POP.CATEGORY}
            hasChevron
            onClick={() => togglePop(POP.CATEGORY)}
            onClear={hasCategory ? () => clearFilterKeys(['category']) : undefined}
          />
          <FilterPopover open={openPop === POP.CATEGORY} onClose={closePop}>
            <CategoryFilterPanel
              lang={lang}
              t={t}
              currentCategory={filters.category}
              onSelect={(code) => patchFilters({ category: code || '' })}
              onClose={closePop}
            />
          </FilterPopover>
        </div>

        <AdsFilterBarTransportChips
          flags={transportFlags}
          filters={filters}
          patchFilters={patchFilters}
          clearFilterKeys={clearFilterKeys}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          lang={lang}
          t={t}
        />

        <AdsFilterBarRealEstateChips
          flags={realEstateFlags}
          filters={filters}
          patchFilters={patchFilters}
          clearFilterKeys={clearFilterKeys}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          t={t}
        />

        {!transportFlags.brand && !realEstateFlags.realEstate && (
          <AdsFilterBarBrandChip
            brands={brands}
            filters={filters}
            patchFilters={patchFilters}
            clearFilterKeys={clearFilterKeys}
            openPop={openPop}
            togglePop={togglePop}
            closePop={closePop}
            lang={lang}
            t={t}
          />
        )}

        {filterFlags.condition !== false && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={t('ads.conditionLabel')}
            active={hasCondition}
            open={openPop === POP.CONDITION}
            hasChevron
            onClick={() => togglePop(POP.CONDITION)}
            onClear={hasCondition ? () => clearFilterKeys(['itemCondition']) : undefined}
          />
          <FilterPopover open={openPop === POP.CONDITION} onClose={closePop}>
            <ConditionFilterPanel
              options={conditionOptions}
              value={filters.itemCondition}
              t={t}
              onDone={(itemCondition) => {
                patchFilters({ itemCondition })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
        )}

        {filterFlags.sellerType !== false && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={t('ads.sellerType')}
            active={hasSeller}
            open={openPop === POP.SELLER}
            hasChevron
            onClick={() => togglePop(POP.SELLER)}
            onClear={hasSeller ? () => clearFilterKeys(['sellerType']) : undefined}
          />
          <FilterPopover open={openPop === POP.SELLER} onClose={closePop}>
            <SellerFilterPanel
              options={sellerOptions}
              value={filters.sellerType}
              t={t}
              onDone={(sellerType) => {
                patchFilters({ sellerType })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
        )}

        {filterFlags.giveAway !== false && (
          <FilterChip
            label={t('ads.giveAway')}
            active={!!filters.giveAway}
            onClick={() => toggleFlag('giveAway')}
          />
        )}

        {filterFlags.urgentBargain !== false && (
          <FilterChip
            label={t('ads.urgentBargain')}
            active={!!filters.urgentBargain}
            onClick={() => toggleFlag('urgentBargain')}
          />
        )}

        {!filterFlags.jobs && (
        <>
        <div className={styles.chipSlot}>
          <FilterChip
            label={t('ads.currency')}
            active={hasCurrency}
            open={openPop === POP.CURRENCY}
            hasChevron
            onClick={() => togglePop(POP.CURRENCY)}
            onClear={hasCurrency ? () => clearFilterKeys(['currency']) : undefined}
          />
          <FilterPopover open={openPop === POP.CURRENCY} onClose={closePop}>
            <CurrencyFilterPanel
              value={filters.currency || 'FROM_AD'}
              t={t}
              onSelect={(currency) => {
                setCurrency(currency)
                closePop()
              }}
            />
          </FilterPopover>
        </div>

        <div className={styles.chipSlot}>
          <FilterChip
            label={t('ads.price')}
            active={hasPrice}
            open={openPop === POP.PRICE}
            hasChevron
            onClick={() => togglePop(POP.PRICE)}
            onClear={hasPrice ? () => clearFilterKeys(['priceFrom', 'priceTo']) : undefined}
          />
          <FilterPopover open={openPop === POP.PRICE} onClose={closePop}>
            <PriceFilterPanel
              priceFrom={filters.priceFrom}
              priceTo={filters.priceTo}
              t={t}
              onDone={({ priceFrom, priceTo }) => {
                patchFilters({ priceFrom, priceTo })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
        </>
        )}
        </>
        )}
      </div>

      {showSort && (
        <div className={styles.toolbarEnd}>
          {endSlot}
          <AdsSortMenu value={filters.sort} onChange={setSort} t={t} />
        </div>
      )}
      {!showSort && endSlot ? (
        <div className={styles.toolbarEnd}>{endSlot}</div>
      ) : null}

      <AdsFiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        t={t}
        lang={lang}
        transportFlags={transportFlags}
        realEstateFlags={realEstateFlags}
        brands={brands}
        isClothingCategory={isClothingCategory}
        filterFlags={filterFlags}
        onApply={(draft) => patchFilters(draft)}
        onReset={resetAllFilters}
      />
    </div>
  )
}

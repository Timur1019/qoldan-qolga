import { useMemo } from 'react'
import FilterChip from './FilterChip'
import FilterPopover from './FilterPopover'
import BrandFilterPanel from './panels/BrandFilterPanel'
import styles from './AdsFilterBar.module.css'

const POP_BRAND = 'brand'

export default function AdsFilterBarBrandChip({
  brands = [],
  filters,
  patchFilters,
  clearFilterKeys,
  openPop,
  togglePop,
  closePop,
  lang,
  t,
}) {
  const brandLabel = useMemo(() => {
    const fallback = lang === 'ru' ? 'Производитель' : 'Ishlab chiqaruvchi'
    if (!filters.brandId) return fallback
    const b = brands.find((x) => String(x.id) === String(filters.brandId))
    return b ? (lang === 'ru' ? b.nameRu : b.nameUz) : fallback
  }, [filters.brandId, brands, lang])

  if (!brands.length) return null

  return (
    <div className={styles.chipSlot}>
      <FilterChip
        label={brandLabel}
        active={Boolean(filters.brandId)}
        open={openPop === POP_BRAND}
        hasChevron
        onClick={() => togglePop(POP_BRAND)}
        onClear={filters.brandId ? () => clearFilterKeys(['brandId', 'modelId']) : undefined}
      />
      <FilterPopover open={openPop === POP_BRAND} onClose={closePop}>
        <div className={styles.panel}>
          <BrandFilterPanel
            brands={brands}
            value={filters.brandId}
            lang={lang}
            t={t}
            onChange={(brandId) => {
              patchFilters({ brandId, modelId: '' })
              closePop()
            }}
          />
        </div>
      </FilterPopover>
    </div>
  )
}

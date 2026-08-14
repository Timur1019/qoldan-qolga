import FilterChip from './FilterChip'
import FilterPopover from './FilterPopover'
import RangeFilterPanel from './panels/RangeFilterPanel'
import EnumMultiFilterPanel from './panels/EnumMultiFilterPanel'
import {
  BUILDING_TYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  RENOVATION_OPTIONS,
  ROOMS_OPTIONS,
} from '../../../../constants/realEstate'
import styles from './AdsFilterBar.module.css'

const POP = {
  DEAL: 'reDeal',
  ROOMS: 'reRooms',
  AREA: 'reArea',
  LAND: 'reLand',
  FLOOR: 'reFloor',
  BUILDING: 'reBuilding',
  RENOVATION: 'reRenovation',
}

export default function AdsFilterBarRealEstateChips({
  flags,
  filters,
  patchFilters,
  clearFilterKeys,
  openPop,
  togglePop,
  closePop,
  t,
}) {
  if (!flags.realEstate) return null

  const rangeLabel = (from, to, fallback) => {
    if (from && to) return `${from}–${to}`
    if (from) return `${from}+`
    if (to) return `–${to}`
    return fallback
  }

  const enumLabel = (values, options, fallback) => {
    if (!values?.length) return fallback
    if (values.length === 1) {
      const opt = options.find((o) => o.value === values[0])
      return opt ? t(opt.labelKey) : fallback
    }
    return `${fallback} · ${values.length}`
  }

  return (
    <>
      {flags.dealType && (
        <EnumChip
          popId={POP.DEAL}
          label={enumLabel(filters.dealType, DEAL_TYPE_OPTIONS, t('ads.dealTypeLabel'))}
          active={(filters.dealType || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.dealType || []).length ? () => clearFilterKeys(['dealType']) : undefined}
          options={DEAL_TYPE_OPTIONS}
          value={filters.dealType}
          onDone={(dealType) => {
            patchFilters({ dealType })
            closePop()
          }}
          t={t}
        />
      )}

      {flags.rooms && (
        <EnumChip
          popId={POP.ROOMS}
          label={enumLabel(filters.rooms, ROOMS_OPTIONS, t('ads.roomsLabel'))}
          active={(filters.rooms || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.rooms || []).length ? () => clearFilterKeys(['rooms']) : undefined}
          options={ROOMS_OPTIONS}
          value={filters.rooms}
          onDone={(rooms) => {
            patchFilters({ rooms })
            closePop()
          }}
          t={t}
        />
      )}

      {flags.area && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={rangeLabel(filters.areaFrom, filters.areaTo, t('ads.areaLabel'))}
            active={Boolean(filters.areaFrom || filters.areaTo)}
            open={openPop === POP.AREA}
            hasChevron
            onClick={() => togglePop(POP.AREA)}
            onClear={(filters.areaFrom || filters.areaTo) ? () => clearFilterKeys(['areaFrom', 'areaTo']) : undefined}
          />
          <FilterPopover open={openPop === POP.AREA} onClose={closePop}>
            <RangeFilterPanel
              from={filters.areaFrom}
              to={filters.areaTo}
              fromLabel={t('ads.priceFrom')}
              toLabel={t('ads.priceTo')}
              min={1}
              t={t}
              onDone={({ from, to }) => {
                patchFilters({ areaFrom: from, areaTo: to })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
      )}

      {flags.landArea && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={rangeLabel(filters.landAreaFrom, filters.landAreaTo, t('ads.landAreaLabel'))}
            active={Boolean(filters.landAreaFrom || filters.landAreaTo)}
            open={openPop === POP.LAND}
            hasChevron
            onClick={() => togglePop(POP.LAND)}
            onClear={(filters.landAreaFrom || filters.landAreaTo) ? () => clearFilterKeys(['landAreaFrom', 'landAreaTo']) : undefined}
          />
          <FilterPopover open={openPop === POP.LAND} onClose={closePop}>
            <RangeFilterPanel
              from={filters.landAreaFrom}
              to={filters.landAreaTo}
              fromLabel={t('ads.priceFrom')}
              toLabel={t('ads.priceTo')}
              min={1}
              t={t}
              onDone={({ from, to }) => {
                patchFilters({ landAreaFrom: from, landAreaTo: to })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
      )}

      {flags.floor && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={rangeLabel(filters.floorFrom, filters.floorTo, t('ads.floorLabel'))}
            active={Boolean(filters.floorFrom || filters.floorTo)}
            open={openPop === POP.FLOOR}
            hasChevron
            onClick={() => togglePop(POP.FLOOR)}
            onClear={(filters.floorFrom || filters.floorTo) ? () => clearFilterKeys(['floorFrom', 'floorTo']) : undefined}
          />
          <FilterPopover open={openPop === POP.FLOOR} onClose={closePop}>
            <RangeFilterPanel
              from={filters.floorFrom}
              to={filters.floorTo}
              fromLabel={t('ads.priceFrom')}
              toLabel={t('ads.priceTo')}
              min={0}
              t={t}
              onDone={({ from, to }) => {
                patchFilters({ floorFrom: from, floorTo: to })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
      )}

      {flags.buildingType && (
        <EnumChip
          popId={POP.BUILDING}
          label={enumLabel(filters.buildingType, BUILDING_TYPE_OPTIONS, t('ads.buildingTypeLabel'))}
          active={(filters.buildingType || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.buildingType || []).length ? () => clearFilterKeys(['buildingType']) : undefined}
          options={BUILDING_TYPE_OPTIONS}
          value={filters.buildingType}
          onDone={(buildingType) => {
            patchFilters({ buildingType })
            closePop()
          }}
          t={t}
        />
      )}

      {flags.renovation && (
        <EnumChip
          popId={POP.RENOVATION}
          label={enumLabel(filters.renovation, RENOVATION_OPTIONS, t('ads.renovationLabel'))}
          active={(filters.renovation || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.renovation || []).length ? () => clearFilterKeys(['renovation']) : undefined}
          options={RENOVATION_OPTIONS}
          value={filters.renovation}
          onDone={(renovation) => {
            patchFilters({ renovation })
            closePop()
          }}
          t={t}
        />
      )}

      {flags.furnished && (
        <FilterChip
          label={t('ads.furnishedLabel')}
          active={filters.furnished === true}
          onClick={() => patchFilters({ furnished: filters.furnished === true ? null : true })}
          onClear={filters.furnished === true ? () => clearFilterKeys(['furnished']) : undefined}
        />
      )}
    </>
  )
}

function EnumChip({
  popId,
  label,
  active,
  openPop,
  togglePop,
  closePop,
  onClear,
  options,
  value,
  onDone,
  t,
}) {
  return (
    <div className={styles.chipSlot}>
      <FilterChip
        label={label}
        active={active}
        open={openPop === popId}
        hasChevron
        onClick={() => togglePop(popId)}
        onClear={onClear}
      />
      <FilterPopover open={openPop === popId} onClose={closePop}>
        <EnumMultiFilterPanel options={options} value={value} onDone={onDone} t={t} />
      </FilterPopover>
    </div>
  )
}

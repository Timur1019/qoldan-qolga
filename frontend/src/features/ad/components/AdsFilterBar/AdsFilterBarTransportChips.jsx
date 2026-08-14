import { useEffect, useMemo, useState } from 'react'
import FilterChip from './FilterChip'
import FilterPopover from './FilterPopover'
import ModelFilterPanel from './panels/ModelFilterPanel'
import RangeFilterPanel from './panels/RangeFilterPanel'
import EnumMultiFilterPanel from './panels/EnumMultiFilterPanel'
import { referenceApi } from '../../services/adApi'
import useVehicleSpecOptions from '../../hooks/useVehicleSpecOptions'
import { vehicleSpecOptionLabel } from '../../../../constants/vehicleSpecOptions'
import styles from './AdsFilterBar.module.css'

const POP = {
  MODEL: 'model',
  YEAR: 'year',
  MILEAGE: 'mileage',
  BODY: 'body',
  TRANS: 'trans',
  FUEL: 'fuel',
  DRIVE: 'drive',
  VOLUME: 'volume',
  COLOR: 'color',
  SEATS: 'seats',
  STEERING: 'steering',
  OWNERS: 'owners',
}

export default function AdsFilterBarTransportChips({
  flags,
  filters,
  patchFilters,
  clearFilterKeys,
  openPop,
  togglePop,
  closePop,
  lang,
  t,
}) {
  const [models, setModels] = useState([])
  const spec = useVehicleSpecOptions()

  useEffect(() => {
    if (!flags.model || !filters.brandId) {
      setModels([])
      return
    }
    referenceApi.getModelsByBrand(filters.brandId)
      .then((list) => setModels(Array.isArray(list) ? list : []))
      .catch(() => setModels([]))
  }, [flags.model, filters.brandId])

  const modelLabel = useMemo(() => {
    if (!filters.modelId) return t('ads.modelLabel')
    const m = models.find((x) => String(x.id) === String(filters.modelId))
    return m ? (lang === 'ru' ? m.nameRu : m.nameUz) : t('ads.modelLabel')
  }, [filters.modelId, models, lang, t])

  if (!flags.motorVehicle) return null

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
      return opt ? vehicleSpecOptionLabel(opt, lang) : fallback
    }
    return `${fallback} · ${values.length}`
  }

  return (
    <>
      {flags.model && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={modelLabel}
            active={Boolean(filters.modelId)}
            open={openPop === POP.MODEL}
            hasChevron
            onClick={() => togglePop(POP.MODEL)}
            onClear={filters.modelId ? () => clearFilterKeys(['modelId']) : undefined}
          />
          <FilterPopover open={openPop === POP.MODEL} onClose={closePop}>
            <div className={styles.panel}>
              <ModelFilterPanel
                models={models}
                value={filters.modelId}
                disabled={!filters.brandId}
                lang={lang}
                t={t}
                onChange={(modelId) => {
                  patchFilters({ modelId })
                  closePop()
                }}
              />
            </div>
          </FilterPopover>
        </div>
      )}

      {flags.year && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={rangeLabel(filters.yearFrom, filters.yearTo, t('ads.yearLabel'))}
            active={Boolean(filters.yearFrom || filters.yearTo)}
            open={openPop === POP.YEAR}
            hasChevron
            onClick={() => togglePop(POP.YEAR)}
            onClear={(filters.yearFrom || filters.yearTo) ? () => clearFilterKeys(['yearFrom', 'yearTo']) : undefined}
          />
          <FilterPopover open={openPop === POP.YEAR} onClose={closePop}>
            <RangeFilterPanel
              from={filters.yearFrom}
              to={filters.yearTo}
              fromLabel={t('ads.priceFrom')}
              toLabel={t('ads.priceTo')}
              min={1950}
              max={new Date().getFullYear() + 1}
              t={t}
              onDone={({ from, to }) => {
                patchFilters({ yearFrom: from, yearTo: to })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
      )}

      {flags.mileage && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={rangeLabel(filters.mileageFrom, filters.mileageTo, t('ads.mileageLabel'))}
            active={Boolean(filters.mileageFrom || filters.mileageTo)}
            open={openPop === POP.MILEAGE}
            hasChevron
            onClick={() => togglePop(POP.MILEAGE)}
            onClear={(filters.mileageFrom || filters.mileageTo) ? () => clearFilterKeys(['mileageFrom', 'mileageTo']) : undefined}
          />
          <FilterPopover open={openPop === POP.MILEAGE} onClose={closePop}>
            <RangeFilterPanel
              from={filters.mileageFrom}
              to={filters.mileageTo}
              fromLabel={t('ads.priceFrom')}
              toLabel={t('ads.priceTo')}
              min={0}
              t={t}
              onDone={({ from, to }) => {
                patchFilters({ mileageFrom: from, mileageTo: to })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
      )}

      {flags.bodyType && (
        <EnumChip
          popId={POP.BODY}
          label={enumLabel(filters.bodyType, spec.bodyType, t('ads.bodyTypeLabel'))}
          active={(filters.bodyType || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.bodyType || []).length ? () => clearFilterKeys(['bodyType']) : undefined}
          options={spec.bodyType}
          value={filters.bodyType}
          onDone={(bodyType) => {
            patchFilters({ bodyType })
            closePop()
          }}
          t={t}
          lang={lang}
        />
      )}
      {flags.transmission && (
        <EnumChip
          popId={POP.TRANS}
          label={enumLabel(filters.transmission, spec.transmission, t('ads.transmissionLabel'))}
          active={(filters.transmission || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.transmission || []).length ? () => clearFilterKeys(['transmission']) : undefined}
          options={spec.transmission}
          value={filters.transmission}
          onDone={(transmission) => {
            patchFilters({ transmission })
            closePop()
          }}
          t={t}
          lang={lang}
        />
      )}
      {flags.fuelType && (
        <EnumChip
          popId={POP.FUEL}
          label={enumLabel(filters.fuelType, spec.fuelType, t('ads.fuelTypeLabel'))}
          active={(filters.fuelType || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.fuelType || []).length ? () => clearFilterKeys(['fuelType']) : undefined}
          options={spec.fuelType}
          value={filters.fuelType}
          onDone={(fuelType) => {
            patchFilters({ fuelType })
            closePop()
          }}
          t={t}
          lang={lang}
        />
      )}
      {flags.driveType && (
        <EnumChip
          popId={POP.DRIVE}
          label={enumLabel(filters.driveType, spec.driveType, t('ads.driveTypeLabel'))}
          active={(filters.driveType || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.driveType || []).length ? () => clearFilterKeys(['driveType']) : undefined}
          options={spec.driveType}
          value={filters.driveType}
          onDone={(driveType) => {
            patchFilters({ driveType })
            closePop()
          }}
          t={t}
          lang={lang}
        />
      )}
      {flags.exteriorColor && (
        <EnumChip
          popId={POP.COLOR}
          label={enumLabel(filters.exteriorColor, spec.exteriorColor, t('ads.colorLabel'))}
          active={(filters.exteriorColor || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.exteriorColor || []).length ? () => clearFilterKeys(['exteriorColor']) : undefined}
          options={spec.exteriorColor}
          value={filters.exteriorColor}
          onDone={(exteriorColor) => {
            patchFilters({ exteriorColor })
            closePop()
          }}
          t={t}
          lang={lang}
        />
      )}
      {flags.seats && (
        <EnumChip
          popId={POP.SEATS}
          label={enumLabel(filters.seats, spec.seats, t('ads.seatsLabel'))}
          active={(filters.seats || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.seats || []).length ? () => clearFilterKeys(['seats']) : undefined}
          options={spec.seats}
          value={filters.seats}
          onDone={(seats) => {
            patchFilters({ seats })
            closePop()
          }}
          t={t}
          lang={lang}
        />
      )}
      {flags.steering && (
        <EnumChip
          popId={POP.STEERING}
          label={enumLabel(filters.steering, spec.steering, t('ads.steeringLabel'))}
          active={(filters.steering || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.steering || []).length ? () => clearFilterKeys(['steering']) : undefined}
          options={spec.steering}
          value={filters.steering}
          onDone={(steering) => {
            patchFilters({ steering })
            closePop()
          }}
          t={t}
          lang={lang}
        />
      )}
      {flags.ownersCount && (
        <EnumChip
          popId={POP.OWNERS}
          label={enumLabel(filters.ownersCount, spec.ownersCount, t('ads.ownersLabel'))}
          active={(filters.ownersCount || []).length > 0}
          openPop={openPop}
          togglePop={togglePop}
          closePop={closePop}
          onClear={(filters.ownersCount || []).length ? () => clearFilterKeys(['ownersCount']) : undefined}
          options={spec.ownersCount}
          value={filters.ownersCount}
          onDone={(ownersCount) => {
            patchFilters({ ownersCount })
            closePop()
          }}
          t={t}
          lang={lang}
        />
      )}

      {flags.engineVolume && (
        <div className={styles.chipSlot}>
          <FilterChip
            label={rangeLabel(filters.engineVolumeFrom, filters.engineVolumeTo, t('ads.engineVolumeLabel'))}
            active={Boolean(filters.engineVolumeFrom || filters.engineVolumeTo)}
            open={openPop === POP.VOLUME}
            hasChevron
            onClick={() => togglePop(POP.VOLUME)}
            onClear={(filters.engineVolumeFrom || filters.engineVolumeTo) ? () => clearFilterKeys(['engineVolumeFrom', 'engineVolumeTo']) : undefined}
          />
          <FilterPopover open={openPop === POP.VOLUME} onClose={closePop}>
            <RangeFilterPanel
              from={filters.engineVolumeFrom}
              to={filters.engineVolumeTo}
              fromLabel={t('ads.priceFrom')}
              toLabel={t('ads.priceTo')}
              min={0.1}
              step={0.1}
              t={t}
              onDone={({ from, to }) => {
                patchFilters({ engineVolumeFrom: from, engineVolumeTo: to })
                closePop()
              }}
            />
          </FilterPopover>
        </div>
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
  lang,
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
        <EnumMultiFilterPanel options={options} value={value} onDone={onDone} t={t} lang={lang} />
      </FilterPopover>
    </div>
  )
}

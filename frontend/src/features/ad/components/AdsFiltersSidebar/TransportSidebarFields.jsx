import { useEffect, useState } from 'react'
import { referenceApi } from '@/api/reference'
import useVehicleSpecOptions from '../../hooks/useVehicleSpecOptions'
import { vehicleSpecOptionLabel } from '../../../../constants/vehicleSpecOptions'
import TransportBrandFilter from './TransportBrandFilter'
import styles from './AdsFiltersSidebar.module.css'

export default function TransportSidebarFields({
  flags,
  filterDraft,
  setFilterDraft,
  brands = [],
  t,
  lang,
}) {
  const [models, setModels] = useState([])
  const spec = useVehicleSpecOptions()

  useEffect(() => {
    if (!flags.model || !filterDraft.brandId) {
      setModels([])
      return
    }
    referenceApi.getModelsByBrand(filterDraft.brandId)
      .then((list) => setModels(Array.isArray(list) ? list : []))
      .catch(() => setModels([]))
  }, [flags.model, filterDraft.brandId])

  if (!flags.motorVehicle && !flags.transport) return null
  if (!flags.motorVehicle) return null

  const toggleMulti = (key, value) => {
    setFilterDraft((d) => {
      const arr = (d[key] || []).map(String)
      const i = arr.indexOf(value)
      if (i >= 0) arr.splice(i, 1)
      else arr.push(value)
      return { ...d, [key]: arr }
    })
  }

  return (
    <>
      {flags.brand && (
        <TransportBrandFilter
          brands={brands}
          brandId={filterDraft.brandId}
          setFilterDraft={setFilterDraft}
          lang={lang}
          t={t}
        />
      )}

      {flags.model && (
        <div className={styles.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.modelLabel')}</p>
          <select
            className="form-select form-select-sm"
            value={filterDraft.modelId || ''}
            disabled={!filterDraft.brandId}
            onChange={(e) => setFilterDraft((d) => ({ ...d, modelId: e.target.value }))}
          >
            <option value="">{t('ads.any')}</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>{lang === 'ru' ? m.nameRu : m.nameUz}</option>
            ))}
          </select>
        </div>
      )}

      {flags.year && (
        <div className={styles.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.yearLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceFrom')} value={filterDraft.yearFrom || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, yearFrom: e.target.value }))} />
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceTo')} value={filterDraft.yearTo || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, yearTo: e.target.value }))} />
          </div>
        </div>
      )}

      {flags.mileage && (
        <div className={styles.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.mileageLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceFrom')} value={filterDraft.mileageFrom || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, mileageFrom: e.target.value }))} />
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceTo')} value={filterDraft.mileageTo || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, mileageTo: e.target.value }))} />
          </div>
        </div>
      )}

      {flags.bodyType && (
        <EnumBlock title={t('ads.bodyTypeLabel')} options={spec.bodyType} fieldKey="bodyType" selected={filterDraft.bodyType} toggle={toggleMulti} lang={lang} />
      )}
      {flags.transmission && (
        <EnumBlock title={t('ads.transmissionLabel')} options={spec.transmission} fieldKey="transmission" selected={filterDraft.transmission} toggle={toggleMulti} lang={lang} />
      )}
      {flags.fuelType && (
        <EnumBlock title={t('ads.fuelTypeLabel')} options={spec.fuelType} fieldKey="fuelType" selected={filterDraft.fuelType} toggle={toggleMulti} lang={lang} />
      )}
      {flags.driveType && (
        <EnumBlock title={t('ads.driveTypeLabel')} options={spec.driveType} fieldKey="driveType" selected={filterDraft.driveType} toggle={toggleMulti} lang={lang} />
      )}
      {flags.exteriorColor && (
        <EnumBlock title={t('ads.colorLabel')} options={spec.exteriorColor} fieldKey="exteriorColor" selected={filterDraft.exteriorColor} toggle={toggleMulti} lang={lang} />
      )}
      {flags.seats && (
        <EnumBlock title={t('ads.seatsLabel')} options={spec.seats} fieldKey="seats" selected={filterDraft.seats} toggle={toggleMulti} lang={lang} />
      )}
      {flags.steering && (
        <EnumBlock title={t('ads.steeringLabel')} options={spec.steering} fieldKey="steering" selected={filterDraft.steering} toggle={toggleMulti} lang={lang} />
      )}
      {flags.ownersCount && (
        <EnumBlock title={t('ads.ownersLabel')} options={spec.ownersCount} fieldKey="ownersCount" selected={filterDraft.ownersCount} toggle={toggleMulti} lang={lang} />
      )}

      {flags.engineVolume && (
        <div className={styles.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.engineVolumeLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control form-control-sm" type="number" step="0.1" placeholder={t('ads.priceFrom')} value={filterDraft.engineVolumeFrom || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, engineVolumeFrom: e.target.value }))} />
            <input className="form-control form-control-sm" type="number" step="0.1" placeholder={t('ads.priceTo')} value={filterDraft.engineVolumeTo || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, engineVolumeTo: e.target.value }))} />
          </div>
        </div>
      )}
    </>
  )
}

function EnumBlock({ title, options, fieldKey, selected = [], toggle, lang }) {
  const selectedArr = (selected || []).map(String)
  return (
    <div className={styles.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{title}</p>
      <div className={styles.checkList}>
        {options.map((o) => {
          const id = `transport-${fieldKey}-${o.value}`
          return (
            <label key={o.value} className={styles.checkRow} htmlFor={id}>
              <input
                type="checkbox"
                id={id}
                className={styles.checkInput}
                checked={selectedArr.includes(o.value)}
                onChange={() => toggle(fieldKey, o.value)}
              />
              <span className={styles.checkLabel}>{vehicleSpecOptionLabel(o, lang)}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

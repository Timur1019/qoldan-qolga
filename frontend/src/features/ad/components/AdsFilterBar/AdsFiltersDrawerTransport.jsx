import { useEffect, useState } from 'react'
import { referenceApi } from '../../services/adApi'
import useVehicleSpecOptions from '../../hooks/useVehicleSpecOptions'
import { vehicleSpecOptionLabel } from '../../../../constants/vehicleSpecOptions'
import styles from './AdsFilterBar.module.css'

export default function AdsFiltersDrawerTransport({ flags, draft, setDraft, brands = [], lang, t }) {
  const [models, setModels] = useState([])
  const spec = useVehicleSpecOptions()

  useEffect(() => {
    if (!flags.model || !draft.brandId) {
      setModels([])
      return
    }
    referenceApi.getModelsByBrand(draft.brandId)
      .then((list) => setModels(Array.isArray(list) ? list : []))
      .catch(() => setModels([]))
  }, [flags.model, draft.brandId])

  if (!flags.motorVehicle) return null

  const toggleMulti = (key, value) => {
    setDraft((d) => {
      const arr = (d[key] || []).map(String)
      const i = arr.indexOf(value)
      if (i >= 0) arr.splice(i, 1)
      else arr.push(value)
      return { ...d, [key]: arr }
    })
  }

  const brandLabel = (b) => {
    const name = lang === 'ru' ? b.nameRu : b.nameUz
    const count = b.adCount != null ? Number(b.adCount) : null
    if (count != null && Number.isFinite(count)) return `${name} (${Math.trunc(count)})`
    return name
  }

  return (
    <>
      {flags.brand && brands.length > 0 && (
        <div className={styles.drawerBlock}>
          <p className={styles.drawerBlockTitle}>{t('ads.brandLabel')}</p>
          <select
            className="form-select"
            value={draft.brandId || ''}
            onChange={(e) => setDraft((d) => ({ ...d, brandId: e.target.value, modelId: '' }))}
          >
            <option value="">{t('ads.any')}</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{brandLabel(b)}</option>
            ))}
          </select>
        </div>
      )}

      {flags.model && (
        <div className={styles.drawerBlock}>
          <p className={styles.drawerBlockTitle}>{t('ads.modelLabel')}</p>
          <select
            className="form-select"
            value={draft.modelId || ''}
            disabled={!draft.brandId}
            onChange={(e) => setDraft((d) => ({ ...d, modelId: e.target.value }))}
          >
            <option value="">{t('ads.any')}</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>{lang === 'ru' ? m.nameRu : m.nameUz}</option>
            ))}
          </select>
        </div>
      )}

      {flags.year && (
        <RangeBlock
          title={t('ads.yearLabel')}
          from={draft.yearFrom}
          to={draft.yearTo}
          onFrom={(v) => setDraft((d) => ({ ...d, yearFrom: v }))}
          onTo={(v) => setDraft((d) => ({ ...d, yearTo: v }))}
          t={t}
        />
      )}

      {flags.mileage && (
        <RangeBlock
          title={t('ads.mileageLabel')}
          from={draft.mileageFrom}
          to={draft.mileageTo}
          onFrom={(v) => setDraft((d) => ({ ...d, mileageFrom: v }))}
          onTo={(v) => setDraft((d) => ({ ...d, mileageTo: v }))}
          t={t}
        />
      )}

      {flags.bodyType && (
        <EnumBlock title={t('ads.bodyTypeLabel')} options={spec.bodyType} fieldKey="bodyType" selected={draft.bodyType} toggle={toggleMulti} lang={lang} />
      )}
      {flags.transmission && (
        <EnumBlock title={t('ads.transmissionLabel')} options={spec.transmission} fieldKey="transmission" selected={draft.transmission} toggle={toggleMulti} lang={lang} />
      )}
      {flags.fuelType && (
        <EnumBlock title={t('ads.fuelTypeLabel')} options={spec.fuelType} fieldKey="fuelType" selected={draft.fuelType} toggle={toggleMulti} lang={lang} />
      )}
      {flags.driveType && (
        <EnumBlock title={t('ads.driveTypeLabel')} options={spec.driveType} fieldKey="driveType" selected={draft.driveType} toggle={toggleMulti} lang={lang} />
      )}
      {flags.exteriorColor && (
        <EnumBlock title={t('ads.colorLabel')} options={spec.exteriorColor} fieldKey="exteriorColor" selected={draft.exteriorColor} toggle={toggleMulti} lang={lang} />
      )}
      {flags.seats && (
        <EnumBlock title={t('ads.seatsLabel')} options={spec.seats} fieldKey="seats" selected={draft.seats} toggle={toggleMulti} lang={lang} />
      )}
      {flags.steering && (
        <EnumBlock title={t('ads.steeringLabel')} options={spec.steering} fieldKey="steering" selected={draft.steering} toggle={toggleMulti} lang={lang} />
      )}
      {flags.ownersCount && (
        <EnumBlock title={t('ads.ownersLabel')} options={spec.ownersCount} fieldKey="ownersCount" selected={draft.ownersCount} toggle={toggleMulti} lang={lang} />
      )}

      {flags.engineVolume && (
        <RangeBlock
          title={t('ads.engineVolumeLabel')}
          from={draft.engineVolumeFrom}
          to={draft.engineVolumeTo}
          step="0.1"
          onFrom={(v) => setDraft((d) => ({ ...d, engineVolumeFrom: v }))}
          onTo={(v) => setDraft((d) => ({ ...d, engineVolumeTo: v }))}
          t={t}
        />
      )}
    </>
  )
}

function RangeBlock({ title, from, to, onFrom, onTo, step, t }) {
  return (
    <div className={styles.drawerBlock}>
      <p className={styles.drawerBlockTitle}>{title}</p>
      <div className={styles.priceRow}>
        <input type="number" min="0" step={step} className={styles.priceInput} placeholder={t('ads.priceFrom')} value={from || ''} onChange={(e) => onFrom(e.target.value)} />
        <span className={styles.priceDash}>—</span>
        <input type="number" min="0" step={step} className={styles.priceInput} placeholder={t('ads.priceTo')} value={to || ''} onChange={(e) => onTo(e.target.value)} />
      </div>
    </div>
  )
}

function EnumBlock({ title, options, fieldKey, selected = [], toggle, lang }) {
  return (
    <div className={styles.drawerBlock}>
      <p className={styles.drawerBlockTitle}>{title}</p>
      {options.map((o) => (
        <label key={o.value} className={styles.checkRow}>
          <input
            type="checkbox"
            className={styles.checkInput}
            checked={(selected || []).includes(o.value)}
            onChange={() => toggle(fieldKey, o.value)}
          />
          <span>{vehicleSpecOptionLabel(o, lang)}</span>
        </label>
      ))}
    </div>
  )
}

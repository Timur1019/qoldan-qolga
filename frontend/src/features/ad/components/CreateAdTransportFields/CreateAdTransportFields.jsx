import { useEffect, useState } from 'react'
import { referenceApi } from '@/api/reference'
import { transportFieldFlags } from '../../../../constants/transport'
import CreateAdCarSpecs from './CreateAdCarSpecs'
import styles from './CreateAdTransportFields.module.css'

export default function CreateAdTransportFields({
  categoryCode,
  categoryBreadcrumb = [],
  form,
  brands,
  onChange,
  t,
  lang,
}) {
  const flags = transportFieldFlags(categoryCode, categoryBreadcrumb)
  const [models, setModels] = useState([])

  useEffect(() => {
    if (!flags.model || !form.brandId) {
      setModels([])
      return
    }
    referenceApi.getModelsByBrand(form.brandId)
      .then((list) => setModels(Array.isArray(list) ? list : []))
      .catch(() => setModels([]))
  }, [flags.model, form.brandId])

  if (!flags.motorVehicle) return null

  const brandName = (b) => (lang === 'ru' ? b.nameRu : b.nameUz)
  const modelName = (m) => (lang === 'ru' ? m.nameRu : m.nameUz)

  return (
    <section className={`app-card ${styles.card}`}>
      <div className={styles.grid}>
        {flags.brand && (
          <div className={brands.length ? '' : styles.full}>
            <label className="form-label fw-semibold" htmlFor="transportBrand">{t('ads.brandLabel')}{flags.cars ? ' *' : ''}</label>
            <select
              id="transportBrand"
              className="form-select"
              value={form.brandId || ''}
              onChange={(e) => onChange({ brandId: e.target.value, modelId: '', modelCustom: '' })}
            >
              <option value="">{t('ads.brandNotSelected')}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{brandName(b)}</option>
              ))}
            </select>
          </div>
        )}

        {flags.model && (
          <div>
            <label className="form-label fw-semibold" htmlFor="transportModel">{t('ads.modelLabel')}{flags.cars ? ' *' : ''}</label>
            <select
              id="transportModel"
              className="form-select"
              value={form.modelId || ''}
              disabled={!form.brandId}
              onChange={(e) => onChange({ modelId: e.target.value, modelCustom: e.target.value ? '' : form.modelCustom })}
            >
              <option value="">{t('ads.brandNotSelected')}</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>{modelName(m)}</option>
              ))}
            </select>
          </div>
        )}

        {flags.model && !form.modelId && (
          <div className={styles.full}>
            <label className="form-label fw-semibold" htmlFor="modelCustom">{t('ads.modelCustomLabel')}{flags.cars ? ' *' : ''}</label>
            <input
              id="modelCustom"
              className="form-control"
              placeholder={t('ads.modelCustomPlaceholder')}
              value={form.modelCustom || ''}
              onChange={(e) => onChange({ modelCustom: e.target.value })}
            />
          </div>
        )}

        {flags.year && (
          <div>
            <label className="form-label fw-semibold" htmlFor="year">{t('ads.yearLabel')}{flags.cars ? ' *' : ''}</label>
            <input
              id="year"
              type="number"
              min="1950"
              max={new Date().getFullYear() + 1}
              className="form-control"
              value={form.year || ''}
              onChange={(e) => onChange({ year: e.target.value })}
            />
          </div>
        )}

        {flags.mileage && (
          <div>
            <label className="form-label fw-semibold" htmlFor="mileage">{t('ads.mileageLabel')}{flags.cars ? ' *' : ''}</label>
            <input
              id="mileage"
              type="number"
              min="0"
              className="form-control"
              value={form.mileage || ''}
              onChange={(e) => onChange({ mileage: e.target.value })}
            />
          </div>
        )}

        {(flags.bodyType || flags.transmission || flags.fuelType || flags.driveType
          || flags.exteriorColor || flags.seats || flags.steering || flags.ownersCount || flags.engineVolume) && (
          <CreateAdCarSpecs form={form} onChange={onChange} t={t} lang={lang} flags={flags} />
        )}
      </div>
    </section>
  )
}

import useVehicleSpecOptions from '../../hooks/useVehicleSpecOptions'
import { vehicleSpecOptionLabel } from '../../../../constants/vehicleSpecOptions'
import styles from './CreateAdTransportFields.module.css'

/**
 * Характеристики ТС по флагам категории (не всё сразу только у легковых).
 */
export default function CreateAdCarSpecs({ form, onChange, t, lang, flags = {} }) {
  const spec = useVehicleSpecOptions()

  return (
    <>
      {flags.bodyType && (
        <SpecSelect id="bodyType" label={t('ads.bodyTypeLabel')} value={form.bodyType} options={spec.bodyType} onChange={(v) => onChange({ bodyType: v })} t={t} lang={lang} />
      )}
      {flags.transmission && (
        <SpecSelect id="transmission" label={t('ads.transmissionLabel')} value={form.transmission} options={spec.transmission} onChange={(v) => onChange({ transmission: v })} t={t} lang={lang} />
      )}
      {flags.fuelType && (
        <SpecSelect id="fuelType" label={t('ads.fuelTypeLabel')} value={form.fuelType} options={spec.fuelType} onChange={(v) => onChange({ fuelType: v })} t={t} lang={lang} />
      )}
      {flags.driveType && (
        <SpecSelect id="driveType" label={t('ads.driveTypeLabel')} value={form.driveType} options={spec.driveType} onChange={(v) => onChange({ driveType: v })} t={t} lang={lang} />
      )}
      {flags.exteriorColor && (
        <SpecSelect id="exteriorColor" label={t('ads.colorLabel')} value={form.exteriorColor} options={spec.exteriorColor} onChange={(v) => onChange({ exteriorColor: v })} t={t} lang={lang} />
      )}
      {flags.seats && (
        <SpecSelect id="seats" label={t('ads.seatsLabel')} value={form.seats} options={spec.seats} onChange={(v) => onChange({ seats: v })} t={t} lang={lang} />
      )}
      {flags.steering && (
        <SpecSelect id="steering" label={t('ads.steeringLabel')} value={form.steering} options={spec.steering} onChange={(v) => onChange({ steering: v })} t={t} lang={lang} />
      )}
      {flags.ownersCount && (
        <SpecSelect id="ownersCount" label={t('ads.ownersLabel')} value={form.ownersCount} options={spec.ownersCount} onChange={(v) => onChange({ ownersCount: v })} t={t} lang={lang} />
      )}
      {flags.engineVolume && (
        <div className={styles.full}>
          <label className="form-label fw-semibold" htmlFor="engineVolume">{t('ads.engineVolumeLabel')}</label>
          <input
            id="engineVolume"
            type="number"
            min="0.1"
            max="20"
            step="0.1"
            className="form-control"
            placeholder="1.6"
            value={form.engineVolume || ''}
            onChange={(e) => onChange({ engineVolume: e.target.value })}
          />
          <div className="form-text">{t('ads.engineVolumeHint') || 'В литрах, например 1.6'}</div>
        </div>
      )}
    </>
  )
}

function SpecSelect({ id, label, value, options, onChange, t, lang }) {
  return (
    <div>
      <label className="form-label fw-semibold" htmlFor={id}>{label}</label>
      <select id={id} className="form-select" value={value || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">{t('ads.any')}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{vehicleSpecOptionLabel(o, lang)}</option>
        ))}
      </select>
    </div>
  )
}

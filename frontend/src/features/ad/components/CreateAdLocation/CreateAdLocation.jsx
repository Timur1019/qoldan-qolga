import OSMMap from '@/components/OSMMap/OSMMap'
import { UiField, UiInput, UiSelect } from '@/shared/ui'
import shared from '../../styles/createAdShared.module.css'
import styles from './CreateAdLocation.module.css'

const TASHKENT = [41.2995, 69.2401]

function defaultExpires() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 16)
}

export default function CreateAdLocation({
  form,
  filterFlags,
  mapPosition,
  onMapPositionChange,
  onMyLocation,
  regions,
  districtOptions,
  onChange,
  t,
  lang,
}) {
  const regionName = (r) => (lang === 'ru' ? r.nameRu : r.nameUz)
  const districtName = (d) => (lang === 'ru' ? d.nameRu : d.nameUz)

  return (
    <>
      <section className={`app-card ${shared.card}`}>
        <h2 className="h6 mb-2">{t('ads.locationTitle')}</h2>
        <p className="text-muted small mb-2">{t('ads.locationHint')}</p>
        <div className={styles.locationActions}>
          <button type="button" className={styles.myLocationBtn} onClick={onMyLocation}>
            <span aria-hidden>✈</span> {t('ads.myLocation')}
          </button>
        </div>
        <div className={styles.mapWrap}>
          <OSMMap
            center={TASHKENT}
            position={mapPosition}
            onPositionChange={onMapPositionChange}
          />
        </div>
        <div className={styles.coordsRow}>
          <UiInput
            size="sm"
            name="locationLat"
            value={form.locationLat}
            readOnly
            placeholder="Широта"
          />
          <UiInput
            size="sm"
            name="locationLng"
            value={form.locationLng}
            readOnly
            placeholder="Долгота"
          />
        </div>
        <UiInput
          name="address"
          value={form.address}
          onChange={onChange}
          className={styles.fieldGap}
          placeholder={t('ads.addressPlaceholder')}
        />
        <UiInput
          name="landmark"
          value={form.landmark}
          onChange={onChange}
          className={styles.fieldGap}
          placeholder={t('ads.landmarkPlaceholder')}
        />
        {filterFlags.canDeliver && (
          <label className={shared.checkRow}>
            <input
              name="canDeliver"
              type="checkbox"
              checked={form.canDeliver}
              onChange={onChange}
            />
            <span>{t('ads.canDeliver')}</span>
          </label>
        )}
      </section>

      <section className={`app-card ${shared.card}`}>
        <UiField label={t('ads.formRegion')} htmlFor="create-ad-region">
          <UiSelect
            id="create-ad-region"
            name="region"
            value={form.region}
            onChange={onChange}
          >
            <option value="">—</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>{regionName(r)}</option>
            ))}
          </UiSelect>
        </UiField>
        <UiField label={t('ads.formDistrict')} htmlFor="create-ad-district">
          <UiSelect
            id="create-ad-district"
            name="district"
            value={form.district}
            onChange={onChange}
            disabled={!form.region}
          >
            <option value="">—</option>
            {districtOptions.map((d) => (
              <option key={d.id} value={districtName(d)}>{districtName(d)}</option>
            ))}
          </UiSelect>
        </UiField>
        <UiField label={`${t('ads.formExpiresAt')} *`} htmlFor="create-ad-expires">
          <UiInput
            id="create-ad-expires"
            name="expiresAt"
            type="datetime-local"
            value={form.expiresAt || defaultExpires()}
            onChange={onChange}
            required
          />
        </UiField>
      </section>
    </>
  )
}

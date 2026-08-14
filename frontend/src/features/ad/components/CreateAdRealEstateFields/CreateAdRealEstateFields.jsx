import { realEstateFieldFlags } from '../../../../constants/realEstate'
import {
  BUILDING_TYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  RENOVATION_OPTIONS,
  ROOMS_OPTIONS,
} from '../../../../constants/realEstate'
import styles from './CreateAdRealEstateFields.module.css'

export default function CreateAdRealEstateFields({
  categoryCode,
  categoryBreadcrumb = [],
  form,
  onChange,
  t,
}) {
  const flags = realEstateFieldFlags(categoryCode, categoryBreadcrumb)
  if (!flags.realEstate) return null

  return (
    <section className={`app-card ${styles.card}`}>
      <div className={styles.grid}>
        {flags.dealType && (
          <div className={styles.full}>
            <p className="form-label fw-semibold mb-2">{t('ads.dealTypeLabel')} *</p>
            <div className={styles.segment}>
              {DEAL_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.segmentBtn} ${form.dealType === opt.value ? styles.segmentActive : ''}`}
                  onClick={() => onChange({ dealType: opt.value })}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}

        {flags.rooms && (
          <div className={styles.full}>
            <p className="form-label fw-semibold mb-2">{t('ads.roomsLabel')} *</p>
            <div className={styles.segment}>
              {ROOMS_OPTIONS.map((opt) => {
                const selected = String(form.rooms) === opt.value || (opt.value === '5PLUS' && Number(form.rooms) >= 5)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.segmentBtn} ${selected ? styles.segmentActive : ''}`}
                    onClick={() => onChange({ rooms: opt.value === '5PLUS' ? '5' : opt.value })}
                  >
                    {t(opt.labelKey)}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {flags.area && (
          <div>
            <label className="form-label fw-semibold" htmlFor="areaM2">{t('ads.areaLabel')} *</label>
            <input
              id="areaM2"
              type="number"
              min="1"
              step="0.1"
              className="form-control"
              value={form.areaM2 || ''}
              onChange={(e) => onChange({ areaM2: e.target.value })}
            />
          </div>
        )}

        {flags.landArea && (
          <div>
            <label className="form-label fw-semibold" htmlFor="landAreaM2">{t('ads.landAreaLabel')} *</label>
            <input
              id="landAreaM2"
              type="number"
              min="1"
              step="0.1"
              className="form-control"
              value={form.landAreaM2 || ''}
              onChange={(e) => onChange({ landAreaM2: e.target.value })}
            />
          </div>
        )}

        {flags.floor && (
          <div>
            <label className="form-label fw-semibold" htmlFor="floor">{t('ads.floorLabel')} *</label>
            <input
              id="floor"
              type="number"
              min="0"
              className="form-control"
              value={form.floor || ''}
              onChange={(e) => onChange({ floor: e.target.value })}
            />
          </div>
        )}

        {flags.floorsTotal && (
          <div>
            <label className="form-label fw-semibold" htmlFor="floorsTotal">{t('ads.floorsTotalLabel')}</label>
            <input
              id="floorsTotal"
              type="number"
              min="1"
              className="form-control"
              value={form.floorsTotal || ''}
              onChange={(e) => onChange({ floorsTotal: e.target.value })}
            />
          </div>
        )}

        {flags.buildingType && (
          <div>
            <label className="form-label fw-semibold" htmlFor="buildingType">{t('ads.buildingTypeLabel')}</label>
            <select
              id="buildingType"
              className="form-select"
              value={form.buildingType || ''}
              onChange={(e) => onChange({ buildingType: e.target.value })}
            >
              <option value="">{t('ads.brandNotSelected')}</option>
              {BUILDING_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
              ))}
            </select>
          </div>
        )}

        {flags.renovation && (
          <div>
            <label className="form-label fw-semibold" htmlFor="renovation">{t('ads.renovationLabel')}</label>
            <select
              id="renovation"
              className="form-select"
              value={form.renovation || ''}
              onChange={(e) => onChange({ renovation: e.target.value })}
            >
              <option value="">{t('ads.brandNotSelected')}</option>
              {RENOVATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
              ))}
            </select>
          </div>
        )}

        {flags.furnished && (
          <div className={styles.full}>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={Boolean(form.furnished)}
                onChange={(e) => onChange({ furnished: e.target.checked })}
              />
              <span>{t('ads.furnishedLabel')}</span>
            </label>
          </div>
        )}

        <div className={styles.full}>
          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={Boolean(form.onlineShowing)}
              onChange={(e) => onChange({ onlineShowing: e.target.checked })}
            />
            <span>{t('ads.onlineShowing')}</span>
          </label>
          <p className="text-muted small mb-0 mt-1">{t('ads.onlineShowingHint')}</p>
        </div>
      </div>
    </section>
  )
}

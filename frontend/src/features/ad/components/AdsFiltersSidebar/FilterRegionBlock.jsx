import styles from './AdsFiltersSidebar.module.css'

export default function FilterRegionBlock({
  regions = [],
  region,
  setFilterDraft,
  t,
  lang,
}) {
  return (
    <div className={styles.sidebarBlock}>
      <label className="form-label small fw-semibold text-secondary">{t('ads.region')}</label>
      <select
        value={region || ''}
        onChange={(e) => setFilterDraft((d) => ({ ...d, region: e.target.value }))}
        className="form-select form-select-sm"
      >
        <option value="">— {t('ads.allRegions')}</option>
        {regions.map((r) => (
          <option key={r.code} value={r.code}>
            {lang === 'ru' ? r.nameRu : r.nameUz}
          </option>
        ))}
      </select>
    </div>
  )
}

import {
  BUILDING_TYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  RENOVATION_OPTIONS,
  ROOMS_OPTIONS,
} from '../../../../constants/realEstate'
import styles from './AdsFiltersSidebar.module.css'

export default function RealEstateSidebarFields({ flags, filterDraft, setFilterDraft, t }) {
  if (!flags.realEstate) return null

  return (
    <>
      {flags.dealType && (
        <MultiCheckBlock
          title={t('ads.dealTypeLabel')}
          options={DEAL_TYPE_OPTIONS}
          fieldKey="dealType"
          idPrefix="re-deal"
          selected={filterDraft.dealType}
          setFilterDraft={setFilterDraft}
          t={t}
        />
      )}
      {flags.rooms && (
        <MultiCheckBlock
          title={t('ads.roomsLabel')}
          options={ROOMS_OPTIONS}
          fieldKey="rooms"
          idPrefix="re-rooms"
          selected={filterDraft.rooms}
          setFilterDraft={setFilterDraft}
          t={t}
        />
      )}
      {flags.area && (
        <div className={styles.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.areaLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceFrom')} value={filterDraft.areaFrom || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, areaFrom: e.target.value }))} />
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceTo')} value={filterDraft.areaTo || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, areaTo: e.target.value }))} />
          </div>
        </div>
      )}
      {flags.landArea && (
        <div className={styles.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.landAreaLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceFrom')} value={filterDraft.landAreaFrom || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, landAreaFrom: e.target.value }))} />
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceTo')} value={filterDraft.landAreaTo || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, landAreaTo: e.target.value }))} />
          </div>
        </div>
      )}
      {flags.floor && (
        <div className={styles.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.floorLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceFrom')} value={filterDraft.floorFrom || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, floorFrom: e.target.value }))} />
            <input className="form-control form-control-sm" type="number" placeholder={t('ads.priceTo')} value={filterDraft.floorTo || ''} onChange={(e) => setFilterDraft((d) => ({ ...d, floorTo: e.target.value }))} />
          </div>
        </div>
      )}
      {flags.buildingType && (
        <MultiCheckBlock
          title={t('ads.buildingTypeLabel')}
          options={BUILDING_TYPE_OPTIONS}
          fieldKey="buildingType"
          idPrefix="re-building"
          selected={filterDraft.buildingType}
          setFilterDraft={setFilterDraft}
          t={t}
        />
      )}
      {flags.renovation && (
        <MultiCheckBlock
          title={t('ads.renovationLabel')}
          options={RENOVATION_OPTIONS}
          fieldKey="renovation"
          idPrefix="re-renovation"
          selected={filterDraft.renovation}
          setFilterDraft={setFilterDraft}
          t={t}
        />
      )}
      {flags.furnished && (
        <div className={styles.sidebarBlock}>
          <p className="small fw-semibold text-secondary mb-2">{t('ads.furnishedLabel')}</p>
          <div className={styles.checkList}>
            <label className={styles.checkRow} htmlFor="re-furnished">
              <input
                type="checkbox"
                id="re-furnished"
                className={styles.checkInput}
                checked={filterDraft.furnished === true}
                onChange={() => setFilterDraft((d) => ({
                  ...d,
                  furnished: d.furnished === true ? null : true,
                }))}
              />
              <span className={styles.checkLabel}>{t('ads.canRentYes')}</span>
            </label>
          </div>
        </div>
      )}
    </>
  )
}

function MultiCheckBlock({ title, options, fieldKey, idPrefix, selected, setFilterDraft, t }) {
  const selectedArr = Array.isArray(selected) ? selected.map(String) : []

  const toggle = (optVal) => {
    const key = String(optVal)
    setFilterDraft((d) => {
      const raw = Array.isArray(d[fieldKey]) ? d[fieldKey] : []
      const arr = raw.map(String)
      const idx = arr.indexOf(key)
      if (idx >= 0) arr.splice(idx, 1)
      else arr.push(key)
      return { ...d, [fieldKey]: arr }
    })
  }

  return (
    <div className={styles.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{title}</p>
      <div className={styles.checkList}>
        {options.map((opt) => {
          const id = `${idPrefix}-${opt.value}`
          const isChecked = selectedArr.includes(String(opt.value))
          return (
            <label key={id} className={styles.checkRow} htmlFor={id}>
              <input
                type="checkbox"
                id={id}
                className={styles.checkInput}
                checked={isChecked}
                onChange={() => toggle(opt.value)}
              />
              <span className={styles.checkLabel}>{t(opt.labelKey)}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

import {
  BUILDING_TYPE_OPTIONS,
  DEAL_TYPE_OPTIONS,
  RENOVATION_OPTIONS,
  ROOMS_OPTIONS,
} from '../../../../constants/realEstate'
import styles from './AdsFilterBar.module.css'

export default function AdsFiltersDrawerRealEstate({ flags, draft, setDraft, t }) {
  if (!flags.realEstate) return null

  const toggleMulti = (key, value) => {
    setDraft((d) => {
      const arr = (d[key] || []).map(String)
      const i = arr.indexOf(value)
      if (i >= 0) arr.splice(i, 1)
      else arr.push(value)
      return { ...d, [key]: arr }
    })
  }

  return (
    <>
      {flags.dealType && (
        <EnumBlock title={t('ads.dealTypeLabel')} options={DEAL_TYPE_OPTIONS} fieldKey="dealType" selected={draft.dealType} toggle={toggleMulti} t={t} />
      )}
      {flags.rooms && (
        <EnumBlock title={t('ads.roomsLabel')} options={ROOMS_OPTIONS} fieldKey="rooms" selected={draft.rooms} toggle={toggleMulti} t={t} />
      )}
      {flags.area && (
        <div className={styles.drawerBlock}>
          <p className={styles.drawerBlockTitle}>{t('ads.areaLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control" type="number" placeholder={t('ads.priceFrom')} value={draft.areaFrom || ''} onChange={(e) => setDraft((d) => ({ ...d, areaFrom: e.target.value }))} />
            <input className="form-control" type="number" placeholder={t('ads.priceTo')} value={draft.areaTo || ''} onChange={(e) => setDraft((d) => ({ ...d, areaTo: e.target.value }))} />
          </div>
        </div>
      )}
      {flags.landArea && (
        <div className={styles.drawerBlock}>
          <p className={styles.drawerBlockTitle}>{t('ads.landAreaLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control" type="number" placeholder={t('ads.priceFrom')} value={draft.landAreaFrom || ''} onChange={(e) => setDraft((d) => ({ ...d, landAreaFrom: e.target.value }))} />
            <input className="form-control" type="number" placeholder={t('ads.priceTo')} value={draft.landAreaTo || ''} onChange={(e) => setDraft((d) => ({ ...d, landAreaTo: e.target.value }))} />
          </div>
        </div>
      )}
      {flags.floor && (
        <div className={styles.drawerBlock}>
          <p className={styles.drawerBlockTitle}>{t('ads.floorLabel')}</p>
          <div className="d-flex gap-2">
            <input className="form-control" type="number" placeholder={t('ads.priceFrom')} value={draft.floorFrom || ''} onChange={(e) => setDraft((d) => ({ ...d, floorFrom: e.target.value }))} />
            <input className="form-control" type="number" placeholder={t('ads.priceTo')} value={draft.floorTo || ''} onChange={(e) => setDraft((d) => ({ ...d, floorTo: e.target.value }))} />
          </div>
        </div>
      )}
      {flags.buildingType && (
        <EnumBlock title={t('ads.buildingTypeLabel')} options={BUILDING_TYPE_OPTIONS} fieldKey="buildingType" selected={draft.buildingType} toggle={toggleMulti} t={t} />
      )}
      {flags.renovation && (
        <EnumBlock title={t('ads.renovationLabel')} options={RENOVATION_OPTIONS} fieldKey="renovation" selected={draft.renovation} toggle={toggleMulti} t={t} />
      )}
      {flags.furnished && (
        <div className={styles.drawerBlock}>
          <p className={styles.drawerBlockTitle}>{t('ads.furnishedLabel')}</p>
          <label className={styles.checkRow} htmlFor="drawer-re-furnished">
            <input
              type="checkbox"
              id="drawer-re-furnished"
              className={styles.checkInput}
              checked={draft.furnished === true}
              onChange={() => setDraft((d) => ({
                ...d,
                furnished: d.furnished === true ? null : true,
              }))}
            />
            <span>{t('ads.canRentYes')}</span>
          </label>
        </div>
      )}
    </>
  )
}

function EnumBlock({ title, options, fieldKey, selected, toggle, t }) {
  const selectedArr = Array.isArray(selected) ? selected.map(String) : []
  return (
    <div className={styles.drawerBlock}>
      <p className={styles.drawerBlockTitle}>{title}</p>
      <ul className={styles.checkList}>
        {options.map((opt) => {
          const id = `drawer-${fieldKey}-${opt.value}`
          return (
            <li key={opt.value}>
              <label className={styles.checkRow} htmlFor={id}>
                <input
                  type="checkbox"
                  id={id}
                  className={styles.checkInput}
                  checked={selectedArr.includes(String(opt.value))}
                  onChange={() => toggle(fieldKey, opt.value)}
                />
                <span>{t(opt.labelKey)}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

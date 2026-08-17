import styles from './AdsFiltersSidebar.module.css'

export default function FilterYesNoCheckboxes({
  title,
  fieldKey,
  value,
  setFilterDraft,
  idPrefix,
  yesLabel,
  noLabel,
}) {
  const normalized = (value === true || value === 'true') ? true : (value === false || value === 'false') ? false : ''
  return (
    <div className={styles.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{title}</p>
      <div className={styles.checkList}>
        <label className={styles.checkRow} htmlFor={`${idPrefix}-yes`}>
          <input
            type="checkbox"
            id={`${idPrefix}-yes`}
            checked={normalized === true}
            onChange={() => setFilterDraft((d) => ({ ...d, [fieldKey]: normalized === true ? '' : true }))}
            className={styles.checkInput}
          />
          <span className={styles.checkLabel}>{yesLabel}</span>
        </label>
        <label className={styles.checkRow} htmlFor={`${idPrefix}-no`}>
          <input
            type="checkbox"
            id={`${idPrefix}-no`}
            checked={normalized === false}
            onChange={() => setFilterDraft((d) => ({ ...d, [fieldKey]: normalized === false ? '' : false }))}
            className={styles.checkInput}
          />
          <span className={styles.checkLabel}>{noLabel}</span>
        </label>
      </div>
    </div>
  )
}

import styles from './AdsFiltersSidebar.module.css'

export default function FilterCheckboxBlock({
  title,
  options,
  value,
  fieldKey,
  idPrefix,
  setFilterDraft,
}) {
  const selected = Array.isArray(value) ? value.map(String) : []
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
        {options.map(({ value: optVal, label }) => {
          const id = `${idPrefix}-${String(optVal)}`
          const isChecked = selected.includes(String(optVal))
          return (
            <label key={id} className={styles.checkRow} htmlFor={id}>
              <input
                type="checkbox"
                id={id}
                checked={isChecked}
                onChange={() => toggle(optVal)}
                className={styles.checkInput}
              />
              <span className={styles.checkLabel}>{label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

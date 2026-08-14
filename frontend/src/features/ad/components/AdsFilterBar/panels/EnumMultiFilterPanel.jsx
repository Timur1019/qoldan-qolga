import { useState } from 'react'
import { vehicleSpecOptionLabel } from '../../../../../constants/vehicleSpecOptions'
import styles from '../AdsFilterBar.module.css'

export default function EnumMultiFilterPanel({ options, value = [], onDone, t, lang = 'ru' }) {
  const [draft, setDraft] = useState(() => (Array.isArray(value) ? [...value] : []))

  const toggle = (optVal) => {
    setDraft((arr) => {
      const next = arr.map(String)
      const i = next.indexOf(optVal)
      if (i >= 0) next.splice(i, 1)
      else next.push(optVal)
      return next
    })
  }

  const labelOf = (o) => {
    if (o.labelKey) return t(o.labelKey)
    return vehicleSpecOptionLabel(o, lang)
  }

  return (
    <div className={styles.panel}>
      <ul className={styles.checkList}>
        {options.map((o) => {
          const checked = draft.map(String).includes(o.value)
          return (
            <li key={o.value}>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={checked}
                  onChange={() => toggle(o.value)}
                />
                <span>{labelOf(o)}</span>
              </label>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className={`${styles.doneBtn} ${draft.length ? styles.doneBtnActive : ''}`}
        disabled={draft.length === 0 && (!value || value.length === 0)}
        onClick={() => onDone(draft)}
      >
        {t('ads.filterDone')}
      </button>
    </div>
  )
}

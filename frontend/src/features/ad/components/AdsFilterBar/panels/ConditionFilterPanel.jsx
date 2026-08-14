import { useState } from 'react'
import styles from '../AdsFilterBar.module.css'

export default function ConditionFilterPanel({ options, value = [], onDone, t }) {
  const [draft, setDraft] = useState(() => (Array.isArray(value) ? [...value] : []))

  const toggle = (optVal) => {
    const key = String(optVal)
    setDraft((arr) => {
      const next = arr.map(String)
      const i = next.indexOf(key)
      if (i >= 0) next.splice(i, 1)
      else next.push(key)
      return next
    })
  }

  return (
    <div className={styles.panel}>
      <ul className={styles.checkList}>
        {options.map(({ value: optVal, label }) => {
          const checked = draft.map(String).includes(String(optVal))
          return (
            <li key={String(optVal)}>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  className={styles.checkInput}
                  checked={checked}
                  onChange={() => toggle(optVal)}
                />
                <span>{label}</span>
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

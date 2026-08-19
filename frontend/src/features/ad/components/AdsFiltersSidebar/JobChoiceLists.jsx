import { useState } from 'react'
import { jobOptionLabel } from '../../../../constants/jobFilterOptions'
import sidebar from './AdsFiltersSidebar.module.css'
import styles from './JobFilters.module.css'

export function JobRadioList({ title, options, value, fieldKey, setFilterDraft, lang }) {
  return (
    <div className={sidebar.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{title}</p>
      <div className={sidebar.checkList}>
        {options.map((o) => {
          const id = `${fieldKey}-${o.value || 'empty'}`
          return (
            <label key={id} className={sidebar.checkRow} htmlFor={id}>
              <input
                id={id}
                type="radio"
                name={fieldKey}
                className={styles.radioInput}
                checked={String(value || '') === String(o.value)}
                onChange={() => setFilterDraft((d) => ({ ...d, [fieldKey]: o.value }))}
              />
              <span className={sidebar.checkLabel}>{jobOptionLabel(o, lang)}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export function JobChipRow({ options, value, fieldKey, setFilterDraft, lang }) {
  return (
    <div className={styles.chipRow}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`${styles.chip} ${String(value) === String(o.value) ? styles.chipOn : ''}`}
          onClick={() => setFilterDraft((d) => ({ ...d, [fieldKey]: o.value }))}
        >
          {jobOptionLabel(o, lang)}
        </button>
      ))}
    </div>
  )
}

export function JobCheckList({ title, options, selected, fieldKey, setFilterDraft, lang, collapsedCount = 5 }) {
  const [expanded, setExpanded] = useState(false)
  const selectedSet = new Set((selected || []).map(String))
  const visible = expanded ? options : options.slice(0, collapsedCount)
  const toggle = (value) => {
    setFilterDraft((d) => {
      const arr = Array.isArray(d[fieldKey]) ? d[fieldKey].map(String) : []
      const idx = arr.indexOf(String(value))
      if (idx >= 0) arr.splice(idx, 1)
      else arr.push(String(value))
      return { ...d, [fieldKey]: arr }
    })
  }
  return (
    <div className={sidebar.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{title}</p>
      <div className={sidebar.checkList}>
        {visible.map((o) => {
          const id = `${fieldKey}-${o.value}`
          return (
            <label key={id} className={sidebar.checkRow} htmlFor={id}>
              <input
                id={id}
                type="checkbox"
                className={sidebar.checkInput}
                checked={selectedSet.has(String(o.value))}
                onChange={() => toggle(o.value)}
              />
              <span className={sidebar.checkLabel}>{jobOptionLabel(o, lang)}</span>
            </label>
          )
        })}
      </div>
      {options.length > collapsedCount && (
        <button type="button" className={styles.moreLink} onClick={() => setExpanded((v) => !v)}>
          {expanded ? (lang === 'ru' ? 'Свернуть' : 'Yig‘ish') : (lang === 'ru' ? 'Показать ещё' : "Ko'proq")}
        </button>
      )}
    </div>
  )
}

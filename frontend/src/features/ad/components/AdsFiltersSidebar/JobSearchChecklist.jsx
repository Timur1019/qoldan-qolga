import { useMemo, useState } from 'react'
import { jobOptionLabel } from '../../../../constants/jobFilterOptions'
import sidebar from './AdsFiltersSidebar.module.css'
import styles from './JobFilters.module.css'

export default function JobSearchChecklist({
  title,
  options,
  selected,
  fieldKey,
  setFilterDraft,
  lang,
  popularTitle,
  allTitle,
  searchPlaceholder,
  moreLabel,
  lessLabel,
  initialVisible = 7,
}) {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const selectedSet = useMemo(() => new Set((selected || []).map(String)), [selected])

  const toggle = (value) => {
    const key = String(value)
    setFilterDraft((d) => {
      const arr = Array.isArray(d[fieldKey]) ? d[fieldKey].map(String) : []
      const idx = arr.indexOf(key)
      if (idx >= 0) arr.splice(idx, 1)
      else arr.push(key)
      return { ...d, [fieldKey]: arr }
    })
  }

  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!q) return options
    return options.filter((o) => jobOptionLabel(o, lang).toLowerCase().includes(q))
  }, [options, q, lang])

  const popular = filtered.filter((o) => o.popular)
  const rest = q ? filtered : filtered.filter((o) => !o.popular)
  const visibleRest = expanded ? rest : rest.slice(0, initialVisible)

  return (
    <div className={sidebar.sidebarBlock}>
      <p className="small fw-semibold text-secondary mb-2">{title}</p>
      <input
        type="search"
        className={styles.searchInput}
        placeholder={searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {popular.length > 0 && !q && (
        <>
          <p className="small fw-semibold mt-3 mb-2">{popularTitle}</p>
          <div className={sidebar.checkList}>
            {popular.map((o) => (
              <CheckRow
                key={o.value}
                id={`${fieldKey}-${o.value}`}
                label={jobOptionLabel(o, lang)}
                checked={selectedSet.has(o.value)}
                onChange={() => toggle(o.value)}
              />
            ))}
          </div>
        </>
      )}
      <p className="small fw-semibold mt-3 mb-2">{allTitle}</p>
      <div className={sidebar.checkList}>
        {visibleRest.map((o) => (
          <CheckRow
            key={o.value}
            id={`${fieldKey}-all-${o.value}`}
            label={jobOptionLabel(o, lang)}
            checked={selectedSet.has(o.value)}
            onChange={() => toggle(o.value)}
          />
        ))}
      </div>
      {rest.length > initialVisible && (
        <button type="button" className={styles.moreLink} onClick={() => setExpanded((v) => !v)}>
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  )
}

function CheckRow({ id, label, checked, onChange }) {
  return (
    <label className={sidebar.checkRow} htmlFor={id}>
      <input id={id} type="checkbox" className={sidebar.checkInput} checked={checked} onChange={onChange} />
      <span className={sidebar.checkLabel}>{label}</span>
    </label>
  )
}

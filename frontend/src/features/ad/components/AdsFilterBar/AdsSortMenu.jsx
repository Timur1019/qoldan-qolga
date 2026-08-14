import { useEffect, useMemo, useRef, useState } from 'react'
import { SORT_VALUES } from '../../hooks/useAdsListFilters'
import styles from './AdsFilterBar.module.css'

const OPTIONS = [
  { value: SORT_VALUES.RECOMMENDED, labelKey: 'ads.sortRecommended' },
  { value: SORT_VALUES.NEWEST, labelKey: 'ads.sortNewest' },
  { value: SORT_VALUES.PRICE_ASC, labelKey: 'ads.sortPriceAsc' },
  { value: SORT_VALUES.PRICE_DESC, labelKey: 'ads.sortPriceDesc' },
]

export default function AdsSortMenu({ value, onChange, t }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = useMemo(
    () => OPTIONS.find((o) => o.value === value) || OPTIONS[1],
    [value]
  )

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className={styles.sortWrap} ref={ref}>
      <button type="button" className={styles.sortTrigger} onClick={() => setOpen((v) => !v)}>
        <i className="bi bi-filter-left" aria-hidden />
        {t(current.labelKey)}
      </button>
      {open && (
        <div className={styles.sortMenu} role="menu">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="menuitem"
              className={`${styles.sortItem} ${o.value === (value || SORT_VALUES.NEWEST) ? styles.sortItemActive : ''}`}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              {t(o.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

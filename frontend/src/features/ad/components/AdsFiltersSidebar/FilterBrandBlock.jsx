import { useMemo, useState } from 'react'
import styles from './AdsFiltersSidebar.module.css'

export default function FilterBrandBlock({
  brands = [],
  brandId = '',
  setFilterDraft,
  lang,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const filteredBrands = useMemo(() => {
    const q = (search || '').trim().toLowerCase()
    if (!q) return brands
    return brands.filter((b) =>
      (b.nameRu || '').toLowerCase().includes(q) || (b.nameUz || '').toLowerCase().includes(q)
    )
  }, [brands, search])

  if (!brands.length) return null

  return (
    <div className={`${styles.sidebarBlock} ${styles.brandBlock}`}>
      <p className="small fw-semibold text-secondary mb-2">{lang === 'ru' ? 'Производитель' : 'Ishlab chiqaruvchi'}</p>
      {!collapsed && (
        <>
          <div className="input-group input-group-sm mb-2">
            <span className="input-group-text bg-light border-end-0" id="brand-search-icon">
              <i className="bi bi-search text-muted" aria-hidden />
            </span>
            <input
              type="search"
              placeholder={lang === 'ru' ? 'Введите название бренда' : 'Brend nomini kiriting'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control border-start-0"
              aria-label={lang === 'ru' ? 'Поиск бренда' : 'Brend qidirish'}
            />
          </div>
          <div className={styles.brandList}>
            {filteredBrands.map((b) => {
              const isChecked = (brandId || '') === b.id
              return (
                <label key={b.id} className={styles.checkRow} htmlFor={`brand-${b.id}`}>
                  <input
                    type="checkbox"
                    className={styles.checkInput}
                    id={`brand-${b.id}`}
                    checked={isChecked}
                    onChange={() => {
                      setFilterDraft((d) => ({ ...d, brandId: isChecked ? '' : b.id, modelId: '' }))
                    }}
                  />
                  <span className={styles.checkLabel}>{lang === 'ru' ? b.nameRu : b.nameUz}</span>
                </label>
              )
            })}
          </div>
        </>
      )}
      <button
        type="button"
        className="btn btn-link p-0 small text-primary text-decoration-none mt-1"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
      >
        {collapsed ? (lang === 'ru' ? 'Развернуть' : 'Yoyish') : (lang === 'ru' ? 'Свернуть' : "Yig'ish")}
        <i className={`bi ms-1 ${collapsed ? 'bi-chevron-down' : 'bi-chevron-up'}`} aria-hidden />
      </button>
    </div>
  )
}

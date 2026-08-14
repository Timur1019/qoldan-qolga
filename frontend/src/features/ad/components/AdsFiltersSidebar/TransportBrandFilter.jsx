import { useMemo, useState } from 'react'
import { brandDisplayName, formatBrandCount } from '../../../../constants/transport'
import styles from './AdsFiltersSidebar.module.css'

const PREVIEW_LIMIT = 8

/**
 * Марка в сайдбаре: поиск + чекбоксы + количество объявлений.
 */
export default function TransportBrandFilter({
  brands = [],
  brandId = '',
  setFilterDraft,
  lang,
  t,
}) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)

  const filtered = useMemo(() => {
    const q = (search || '').trim().toLowerCase()
    if (!q) return brands
    return brands.filter((b) =>
      (b.nameRu || '').toLowerCase().includes(q)
      || (b.nameUz || '').toLowerCase().includes(q)
      || (b.slug || '').toLowerCase().includes(q)
    )
  }, [brands, search])

  const visible = expanded || search.trim() ? filtered : filtered.slice(0, PREVIEW_LIMIT)
  const canExpand = !search.trim() && filtered.length > PREVIEW_LIMIT

  if (!brands.length) return null

  return (
    <div className={`${styles.sidebarBlock} ${styles.brandBlock}`}>
      <p className="small fw-semibold text-secondary mb-2">{t('ads.brandLabel')}</p>
      <div className="input-group input-group-sm mb-2">
        <span className="input-group-text bg-light border-end-0">
          <i className="bi bi-search text-muted" aria-hidden />
        </span>
        <input
          type="search"
          className="form-control border-start-0"
          placeholder={t('ads.brandAny')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t('ads.brandLabel')}
        />
      </div>
      <div className={styles.brandList}>
        {visible.map((b) => {
          const isChecked = String(brandId || '') === String(b.id)
          const count = formatBrandCount(b.adCount)
          const id = `transport-brand-${b.id}`
          return (
            <label key={b.id} className={styles.checkRow} htmlFor={id}>
              <input
                type="checkbox"
                id={id}
                className={styles.checkInput}
                checked={isChecked}
                onChange={() => {
                  setFilterDraft((d) => ({
                    ...d,
                    brandId: isChecked ? '' : b.id,
                    modelId: '',
                  }))
                }}
              />
              <span className={styles.checkLabel}>
                {brandDisplayName(b, lang)}
                {count !== '' && (
                  <span className={styles.brandCount}>{count}</span>
                )}
              </span>
            </label>
          )
        })}
        {visible.length === 0 && (
          <p className="small text-secondary mb-0">{t('ads.brandNotFound')}</p>
        )}
      </div>
      {canExpand && (
        <button
          type="button"
          className="btn btn-link p-0 small text-primary text-decoration-none mt-1"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? t('ads.showLess') : t('ads.showMore')}
        </button>
      )}
    </div>
  )
}

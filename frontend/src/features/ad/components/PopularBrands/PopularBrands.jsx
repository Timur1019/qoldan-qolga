import { brandDisplayName, formatBrandCount } from '../../../../constants/transport'
import styles from './PopularBrands.module.css'

/**
 * Блок популярных марок со счётчиками (как на Avito) — вместо чипа «Марка».
 */
export default function PopularBrands({
  brands = [],
  selectedBrandId = '',
  onSelect,
  lang,
  t,
  title,
}) {
  const list = (brands || []).filter((b) => {
    const name = brandDisplayName(b, lang)
    if (!name) return false
    // скрываем «Другая марка» в популярных
    const slug = (b.slug || '').toLowerCase()
    return slug !== 'other' && slug !== 'drugaya-marka' && !/друг/i.test(name)
  })

  if (!list.length) return null

  const popular = list.filter((b) => b.isPopular)
  const shown = (popular.length >= 6 ? popular : list).slice(0, 16)

  return (
    <section className={styles.wrap} aria-label={title || t('ads.popularBrands')}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title || t('ads.popularBrands')}</h2>
        {selectedBrandId && (
          <button type="button" className={styles.clear} onClick={() => onSelect?.('')}>
            {t('ads.any')}
          </button>
        )}
      </div>
      <ul className={styles.grid}>
        {shown.map((b) => {
          const active = String(selectedBrandId) === String(b.id)
          const count = formatBrandCount(b.adCount)
          return (
            <li key={b.id}>
              <button
                type="button"
                className={`${styles.item} ${active ? styles.itemActive : ''}`}
                onClick={() => onSelect?.(active ? '' : b.id)}
              >
                <span className={styles.name}>{brandDisplayName(b, lang)}</span>
                {count !== '' && <span className={styles.count}>{count}</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

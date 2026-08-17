import { useEffect, useState } from 'react'
import { referenceApi } from '@/api/reference'
import CategoryIcon from '../../../../../components/ui/CategoryIcon'
import styles from '../AdsFilterBar.module.css'

export default function CategoryFilterPanel({
  lang,
  t,
  currentCategory,
  onSelect,
  onClose,
}) {
  const [roots, setRoots] = useState([])
  const [stack, setStack] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const nameOf = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')

  useEffect(() => {
    let cancelled = false
    referenceApi.getCategories()
      .then((list) => {
        if (!cancelled) setRoots(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (!cancelled) setRoots([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const currentLevel = stack.length === 0 ? roots : (stack[stack.length - 1]?.children || [])
  const title = stack.length === 0
    ? t('ads.filterCategoryTitle')
    : stack[stack.length - 1].name

  const q = search.trim().toLowerCase()
  const filtered = !q
    ? currentLevel
    : currentLevel.filter((c) => nameOf(c).toLowerCase().includes(q))

  const openChildren = async (cat) => {
    if (!cat?.hasChildren) {
      onSelect(cat.code)
      onClose?.()
      return
    }
    try {
      const kids = await referenceApi.getCategoryChildren(cat.code)
      setStack((s) => [...s, { code: cat.code, name: nameOf(cat), children: Array.isArray(kids) ? kids : [] }])
      setSearch('')
    } catch {
      onSelect(cat.code)
      onClose?.()
    }
  }

  const goBack = () => {
    setStack((s) => s.slice(0, -1))
    setSearch('')
  }

  const selectAllInLevel = () => {
    if (stack.length === 0) {
      onSelect('')
    } else {
      onSelect(stack[stack.length - 1].code)
    }
    onClose?.()
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        {stack.length > 0 ? (
          <button type="button" className={styles.backBtn} onClick={goBack} aria-label="Back">
            <i className="bi bi-chevron-left" aria-hidden />
          </button>
        ) : null}
        <h3 className={styles.panelTitle}>{title}</h3>
      </div>
      <div className={styles.searchWrap}>
        <i className={`bi bi-search ${styles.searchIcon}`} aria-hidden />
        <input
          type="search"
          className={styles.searchInput}
          placeholder={t('ads.filterCategorySearch')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading ? (
        <p className={styles.panelHint}>{t('common.loading')}</p>
      ) : (
        <ul className={styles.catList}>
          {stack.length > 0 && (
            <li>
              <button type="button" className={styles.catRow} onClick={selectAllInLevel}>
                <span>{t('ads.filterAllInCategory')}</span>
                <span className={`${styles.radio} ${currentCategory === stack[stack.length - 1].code ? styles.radioOn : ''}`} />
              </button>
            </li>
          )}
          {filtered.map((cat) => {
            const code = cat.code
            const selected = currentCategory === code
            return (
              <li key={code}>
                <button type="button" className={styles.catRow} onClick={() => openChildren(cat)}>
                  <span className={styles.catRowMain}>
                    <span className={styles.catThumb} aria-hidden>
                      <CategoryIcon code={code} parentCode={cat.parentCode || stack[stack.length - 1]?.code} />
                    </span>
                    <span>{nameOf(cat)}</span>
                  </span>
                  {cat.hasChildren ? (
                    <i className="bi bi-chevron-right text-muted" aria-hidden />
                  ) : (
                    <span className={`${styles.radio} ${selected ? styles.radioOn : ''}`} />
                  )}
                </button>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className={styles.panelHint}>{t('ads.noAds')}</li>
          )}
        </ul>
      )}
    </div>
  )
}

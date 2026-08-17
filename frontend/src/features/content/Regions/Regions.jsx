import { useEffect, useMemo, useState } from 'react'
import { useLang } from '@/context/LangContext'
import { referenceApi } from '@/api/reference'
import ScrollTop from '@/components/ui/ScrollTop'
import RegionCard from './components/RegionCard'
import styles from './Regions.module.css'

export default function Regions() {
  const { t, lang } = useLang()
  const [regions, setRegions] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [openCode, setOpenCode] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = t('regions.pageTitle')
    return () => {
      document.title = 'Qoldan Qolga'
    }
  }, [t])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      referenceApi.getRegions().then((list) => (Array.isArray(list) ? list : [])).catch(() => []),
      referenceApi.getCategories().then((list) => (Array.isArray(list) ? list : [])).catch(() => []),
    ]).then(([nextRegions, nextCategories]) => {
      setRegions(nextRegions)
      setCategories(nextCategories)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return regions
    return regions.filter((region) => {
      const regionName = `${region.nameRu || ''} ${region.nameUz || ''}`.toLowerCase()
      if (regionName.includes(q)) return true
      return (region.districts || []).some((d) =>
        `${d.nameRu || ''} ${d.nameUz || ''}`.toLowerCase().includes(q)
      )
    })
  }, [regions, query])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('regions.pageTitle')}</h1>
        <label className={styles.search}>
          <i className="bi bi-search" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('regions.searchPlaceholder')}
          />
        </label>
      </header>

      {loading && <p className={styles.status}>{t('common.loading')}</p>}

      {!loading && filtered.length === 0 && (
        <p className={styles.status}>{t('regions.empty')}</p>
      )}

      <div className={styles.list}>
        {filtered.map((region) => (
          <RegionCard
            key={region.code || region.id}
            region={region}
            categories={categories}
            expanded={openCode === region.code}
            onToggle={() => setOpenCode((prev) => (prev === region.code ? '' : region.code))}
            lang={lang}
            t={t}
          />
        ))}
      </div>
      <ScrollTop />
    </div>
  )
}

import { useState, useMemo, useEffect } from 'react'
import { useLang } from '../../context/LangContext'
import { referenceApi } from '../../api/client'
import CategoryIcon from '../ui/CategoryIcon'
import styles from './CategorySelectModal.module.css'

export default function CategorySelectModal({ categories, value, onSelect, onClose }) {
  const { lang } = useLang()
  const [search, setSearch] = useState('')
  const [currentParent, setCurrentParent] = useState(null)
  const [currentList, setCurrentList] = useState(Array.isArray(categories) ? categories : [])
  const [parentStack, setParentStack] = useState([])
  const [childrenCache, setChildrenCache] = useState({})
  const [loading, setLoading] = useState(false)

  const titleLabel = lang === 'ru' ? 'Категория' : 'Kategoriya'
  const searchPlaceholder = lang === 'ru' ? 'Найти...' : 'Qidirish...'

  const name = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')

  useEffect(() => {
    const list = Array.isArray(categories) ? categories : []
    setCurrentParent(null)
    setParentStack([])
    setChildrenCache({})
    setCurrentList(list)
    setSearch('')
  }, [categories])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = Array.isArray(currentList) ? currentList : []
    if (!q) return list
    return list.filter((c) => name(c).toLowerCase().includes(q))
  }, [currentList, search, lang])

  const goBack = () => {
    if (!currentParent) {
      onClose?.()
      return
    }
    setSearch('')
    setParentStack((prev) => {
      const next = [...prev]
      const prevParent = next.pop() || null
      setCurrentParent(prevParent)
      if (!prevParent) {
        setCurrentList(Array.isArray(categories) ? categories : [])
      } else {
        setCurrentList(childrenCache[prevParent.code] || [])
      }
      return next
    })
  }

  const handleItemClick = async (cat) => {
    if (cat.hasChildren) {
      const cached = childrenCache[cat.code]
      setSearch('')
      if (cached) {
        setParentStack((prev) => [...prev, currentParent])
        setCurrentParent(cat)
        setCurrentList(cached)
        return
      }
      try {
        setLoading(true)
        const children = await referenceApi.getCategoryChildren(cat.code)
        const list = Array.isArray(children) ? children : []
        setChildrenCache((prev) => ({ ...prev, [cat.code]: list }))
        setParentStack((prev) => [...prev, currentParent])
        setCurrentParent(cat)
        setCurrentList(list)
      } finally {
        setLoading(false)
      }
    } else {
      onSelect?.(cat)
      onClose?.()
    }
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label={titleLabel}>
      <div className={`app-card ${styles.modal}`}>
        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            {currentParent && (
              <button
                type="button"
                className="btn btn-light btn-sm rounded-circle p-0"
                style={{ width: 32, height: 32 }}
                onClick={goBack}
                aria-label={lang === 'ru' ? 'Назад' : 'Orqaga'}
              >
                <i className="bi bi-chevron-left" aria-hidden />
              </button>
            )}
            <h2 className="h6 mb-0 fw-bold">{currentParent ? name(currentParent) : titleLabel}</h2>
          </div>
          <button
            type="button"
            className="btn btn-link p-0 text-secondary"
            onClick={onClose}
            aria-label={lang === 'ru' ? 'Закрыть' : 'Yopish'}
          >
            <i className="bi bi-x-lg" aria-hidden />
          </button>
        </div>
        <div className="mb-3">
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.listWrap}>
          <ul className="list-group list-group-flush">
            {filtered.map((c) => (
              <li key={c.code} className="list-group-item border-0 px-0">
                <button
                  type="button"
                  className={`btn w-100 d-flex align-items-center justify-content-between rounded ${value === c.code ? 'btn-primary' : 'btn-light'}`}
                  onClick={() => handleItemClick(c)}
                >
                  <span className="text-start d-flex align-items-center gap-2">
                    <CategoryIcon code={c.code} parentCode={c.parentCode || currentParent?.code} className="text-secondary" />
                    {name(c)}
                  </span>
                  {c.hasChildren ? (
                    <i className="bi bi-chevron-right" aria-hidden />
                  ) : (
                    value === c.code && <i className="bi bi-check-lg" aria-hidden />
                  )}
                </button>
              </li>
            ))}
            {loading && (
              <li className="list-group-item border-0 text-muted small">
                {lang === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}


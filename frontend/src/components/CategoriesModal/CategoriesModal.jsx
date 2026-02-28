import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { referenceApi } from '../../api/client'
import { categoryPath, adsCategoryPath } from '../../constants/routes'
import styles from './CategoriesModal.module.css'

const CATEGORY_ICONS = { Xizmatlar: 'clipboard', Ish: 'briefcase', Transport: 'car-front' }
const MAX_ITEMS_PER_GROUP = 4

function CategoryIcon({ code }) {
  const name = CATEGORY_ICONS[code] || 'folder'
  return <i className={`bi bi-${name} text-secondary ${styles.catIcon}`} aria-hidden />
}

export default function CategoriesModal({ onClose }) {
  const { lang } = useLang()
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState(null)
  const [childrenOfSelected, setChildrenOfSelected] = useState([])
  const [groupChildren, setGroupChildren] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedGroups, setExpandedGroups] = useState({})

  useEffect(() => {
    referenceApi.getCategories().then((list) => {
      const arr = Array.isArray(list) ? list : []
      setCategories(arr)
      if (arr.length > 0) setSelected((prev) => prev ?? arr[0])
    }).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!selected?.code) {
      setChildrenOfSelected([])
      setGroupChildren({})
      setExpandedGroups({})
      return
    }
    referenceApi.getCategoryChildren(selected.code).then((list) => {
      setChildrenOfSelected(Array.isArray(list) ? list : [])
      setGroupChildren({})
      setExpandedGroups({})
    }).catch(() => setChildrenOfSelected([]))
  }, [selected?.code])

  useEffect(() => {
    const withChildren = childrenOfSelected.filter((c) => c.hasChildren)
    if (withChildren.length === 0) return
    let cancelled = false
    withChildren.forEach((child) => {
      referenceApi.getCategoryChildren(child.code).then((list) => {
        if (!cancelled) {
          setGroupChildren((prev) => ({ ...prev, [child.code]: Array.isArray(list) ? list : [] }))
        }
      }).catch(() => {
        if (!cancelled) setGroupChildren((prev) => ({ ...prev, [child.code]: [] }))
      })
    })
    return () => { cancelled = true }
  }, [childrenOfSelected])

  const name = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')
  const closeLabel = lang === 'ru' ? 'Закрыть' : 'Yopish'
  const titleLabel = lang === 'ru' ? 'Категории' : 'Kategoriyalar'
  const searchPlaceholder = lang === 'ru' ? 'Найти объявление...' : "E'lon qidirish..."
  const hintLabel = lang === 'ru' ? 'Выберите категорию слева' : "Chapdan kategoriyani tanlang"
  const moreLabel = (n) => (lang === 'ru' ? `Ещё ${n}` : `Yana ${n}`)
  const collapseLabel = lang === 'ru' ? 'Свернуть' : "Yig'ish"

  const toggleGroupExpanded = (code) => {
    setExpandedGroups((prev) => ({ ...prev, [code]: !prev[code] }))
  }

  const filteredCategories = searchQuery.trim()
    ? categories.filter((c) => name(c).toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : categories

  return (
    <div className={styles.dropdown} role="dialog" aria-modal="true" aria-label={titleLabel}>
      <div className={styles.panel}>
        <div className={`d-flex align-items-center justify-content-between gap-2 flex-wrap p-3 border-bottom ${styles.panelHeader}`}>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-link p-0 fw-bold text-dark text-decoration-none"
              onClick={() => categories.length > 0 && setSelected(categories[0])}
              aria-label={titleLabel}
            >
              {titleLabel}
              <i className="bi bi-chevron-right ms-1" aria-hidden />
            </button>
            <button type="button" className="btn btn-link p-0 text-secondary" onClick={onClose} aria-label={closeLabel}>
              <i className="bi bi-x-lg" aria-hidden />
            </button>
          </div>
          <div className="input-group flex-grow-1" style={{ maxWidth: 360 }}>
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={searchPlaceholder}
            />
            <span className="input-group-text bg-white"><i className="bi bi-search text-muted" aria-hidden /></span>
          </div>
        </div>
        <div className={styles.columns}>
          <div className={styles.leftCol}>
            <ul className={styles.catList}>
              {filteredCategories.map((cat) => (
                <li key={cat.code}>
                  <button
                    type="button"
                    className={`btn w-100 d-flex align-items-center gap-2 text-start border-0 rounded-0 py-2 px-3 ${selected?.code === cat.code ? styles.catItemActive : styles.catItem}`}
                    onClick={() => setSelected(cat)}
                  >
                    <CategoryIcon code={cat.code} />
                    <span className="flex-grow-1">{name(cat)}</span>
                    <i className="bi bi-chevron-right text-muted small" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.rightCol}>
            {selected ? (
              <>
                <Link
                  to={adsCategoryPath(selected.code)}
                  className="fw-bold text-dark text-decoration-none d-flex align-items-center gap-1 mb-3"
                  onClick={onClose}
                >
                  <span>{name(selected)}</span>
                  <i className="bi bi-chevron-right" aria-hidden />
                </Link>
                <div className={styles.groups}>
                  {childrenOfSelected.map((child) => (
                    <div key={child.code} className={styles.group}>
                      {child.hasChildren ? (
                        <>
                          <Link
                            to={categoryPath(child.code)}
                            className="fw-bold text-dark text-decoration-none d-inline-flex align-items-center gap-1"
                            onClick={onClose}
                          >
                            {name(child)}
                            <i className="bi bi-chevron-right small" aria-hidden />
                          </Link>
                          <ul className={styles.groupList}>
                            {(() => {
                              const list = groupChildren[child.code] || []
                              const isExpanded = expandedGroups[child.code]
                              const visible = isExpanded ? list : list.slice(0, MAX_ITEMS_PER_GROUP)
                              return visible.map((sub) => (
                                <li key={sub.code}>
                                  <Link to={adsCategoryPath(sub.code)} className="text-dark text-decoration-none small" onClick={onClose}>
                                    {name(sub)}
                                  </Link>
                                </li>
                              ))
                            })()}
                          </ul>
                          {(() => {
                            const list = groupChildren[child.code] || []
                            const isExpanded = expandedGroups[child.code]
                            const hiddenCount = list.length - MAX_ITEMS_PER_GROUP
                            if (list.length <= MAX_ITEMS_PER_GROUP) return null
                            if (isExpanded) {
                              return (
                                <button
                                  type="button"
                                  className="btn btn-link p-0 small text-primary text-decoration-none"
                                  onClick={() => toggleGroupExpanded(child.code)}
                                  aria-expanded="true"
                                >
                                  {collapseLabel}
                                  <i className="bi bi-chevron-up ms-1" aria-hidden />
                                </button>
                              )
                            }
                            return (
                              <button
                                type="button"
                                className="btn btn-link p-0 small text-primary text-decoration-none"
                                onClick={() => toggleGroupExpanded(child.code)}
                                aria-expanded="false"
                              >
                                {moreLabel(hiddenCount)}
                                <i className="bi bi-chevron-down ms-1" aria-hidden />
                              </button>
                            )
                          })()}
                        </>
                      ) : (
                        <Link
                          to={adsCategoryPath(child.code)}
                          className="fw-bold text-dark text-decoration-none d-inline-flex align-items-center gap-1"
                          onClick={onClose}
                        >
                          {name(child)}
                          <i className="bi bi-chevron-right small" aria-hidden />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-muted small mb-0">{hintLabel}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { referenceApi } from '../../api/client'
import { categoryPath, adsCategoryPath } from '../../constants/routes'
import styles from './CategoriesModal.module.css'

const CATEGORY_ICONS = { Xizmatlar: 'clipboard', Ish: 'briefcase', Transport: 'car' }
const MAX_ITEMS_PER_GROUP = 4

function CategoryIcon({ code }) {
  const name = CATEGORY_ICONS[code] || 'folder'
  const svgProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5' }
  if (name === 'clipboard') {
    return (
      <span className={styles.catIcon} aria-hidden>
        <svg {...svgProps}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </span>
    )
  }
  if (name === 'briefcase') {
    return (
      <span className={styles.catIcon} aria-hidden>
        <svg {...svgProps}>
          <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </span>
    )
  }
  if (name === 'car') {
    return (
      <span className={styles.catIcon} aria-hidden>
        <svg {...svgProps}>
          <path d="M8 7h8m-8 4h8m4 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m12 0V9a2 2 0 00-2-2h-2m-4 0H6a2 2 0 00-2 2v6" />
        </svg>
      </span>
    )
  }
  return (
    <span className={styles.catIcon} aria-hidden>
      <svg {...svgProps}>
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    </span>
  )
}

function ArrowRight() {
  return (
    <span className={styles.arrow} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </span>
  )
}

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export default function CategoriesModal({ onClose }) {
  const { lang } = useLang()
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState(null)
  const [childrenOfSelected, setChildrenOfSelected] = useState([])
  const [groupChildren, setGroupChildren] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

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
      return
    }
    referenceApi.getCategoryChildren(selected.code).then((list) => {
      setChildrenOfSelected(Array.isArray(list) ? list : [])
      setGroupChildren({})
    }).catch(() => setChildrenOfSelected([]))
  }, [selected?.code])

  useEffect(() => {
    const withChildren = childrenOfSelected.filter((c) => c.hasChildren)
    if (withChildren.length === 0) return
    let cancelled = false
    const next = {}
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

  const filteredCategories = searchQuery.trim()
    ? categories.filter((c) => name(c).toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : categories

  return (
    <div className={styles.dropdown} role="dialog" aria-modal="true" aria-label={titleLabel}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.titlePill}>{titleLabel}</span>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={closeLabel}>
              ×
            </button>
          </div>
          <div className={styles.searchWrap}>
            <input
              type="search"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={searchPlaceholder}
            />
            <SearchIcon />
          </div>
        </div>
        <div className={styles.columns}>
          <div className={styles.leftCol}>
            <ul className={styles.catList}>
              {filteredCategories.map((cat) => (
                <li key={cat.code}>
                  <button
                    type="button"
                    className={selected?.code === cat.code ? styles.catItemActive : styles.catItem}
                    onClick={() => setSelected(cat)}
                  >
                    <CategoryIcon code={cat.code} />
                    <span className={styles.catName}>{name(cat)}</span>
                    <ArrowRight />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.rightCol}>
            {selected ? (
              <>
                <div className={styles.rightTitle}>
                  <span>{name(selected)}</span>
                  <ArrowRight />
                </div>
                <div className={styles.groups}>
                  {childrenOfSelected.map((child) => (
                    <div key={child.code} className={styles.group}>
                      {child.hasChildren ? (
                        <>
                          <Link
                            to={categoryPath(child.code)}
                            className={styles.groupTitle}
                            onClick={onClose}
                          >
                            {name(child)}
                            <ArrowRight />
                          </Link>
                          <ul className={styles.groupList}>
                            {(groupChildren[child.code] || []).slice(0, MAX_ITEMS_PER_GROUP).map((sub) => (
                              <li key={sub.code}>
                                <Link to={adsCategoryPath(sub.code)} className={styles.groupItem} onClick={onClose}>
                                  {name(sub)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {(groupChildren[child.code]?.length || 0) > MAX_ITEMS_PER_GROUP && (
                            <Link
                              to={categoryPath(child.code)}
                              className={styles.moreLink}
                              onClick={onClose}
                            >
                              {moreLabel((groupChildren[child.code].length - MAX_ITEMS_PER_GROUP))}
                            </Link>
                          )}
                        </>
                      ) : (
                        <Link
                          to={adsCategoryPath(child.code)}
                          className={styles.groupTitle}
                          onClick={onClose}
                        >
                          {name(child)}
                          <ArrowRight />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className={styles.hint}>{hintLabel}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

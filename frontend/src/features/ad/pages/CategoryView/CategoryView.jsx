import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import { referenceApi } from '../../services/adApi'
import { ROUTES, categoryPath, adsCategoryPath } from '../../../../constants/routes'
import styles from './CategoryView.module.css'

export default function CategoryView() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const [category, setCategory] = useState(null)
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const name = (c) => (c ? (lang === 'ru' ? c.nameRu : c.nameUz) : '')

  useEffect(() => {
    if (!code) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setLoading(true)
    setNotFound(false)
    Promise.all([
      referenceApi.getCategory(code).catch(() => null),
      referenceApi.getCategoryChildren(code).catch(() => []),
    ]).then(([cat, list]) => {
      setCategory(cat || null)
      setChildren(Array.isArray(list) ? list : [])
      if (!cat) setNotFound(true)
      setLoading(false)
    })
  }, [code])

  useEffect(() => {
    if (loading || notFound) return
    if (!category) return
    if (children.length === 0) {
      navigate(adsCategoryPath(code), { replace: true })
    }
  }, [loading, notFound, category, children.length, code, navigate])

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>{t('common.loading')}</p>
      </div>
    )
  }

  if (notFound || !category) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>{t('category.notFound')}</p>
        <Link to={ROUTES.HOME} className={styles.backLink}>{t('category.backHome')}</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link to={ROUTES.HOME}>{t('nav.home')}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{name(category)}</span>
      </nav>
      <h1 className={styles.title}>{name(category)}</h1>
      <ul className={styles.list}>
        {children.map((child) => (
          <li key={child.code}>
            {child.hasChildren ? (
              <Link to={categoryPath(child.code)} className={styles.card}>
                <span className={styles.cardTitle}>{name(child)}</span>
                <span className={styles.cardArrow} aria-hidden>→</span>
              </Link>
            ) : (
              <Link to={adsCategoryPath(child.code)} className={styles.card}>
                <span className={styles.cardTitle}>{name(child)}</span>
                <span className={styles.cardHint}>{t('home.viewAds')}</span>
                <span className={styles.cardArrow} aria-hidden>→</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

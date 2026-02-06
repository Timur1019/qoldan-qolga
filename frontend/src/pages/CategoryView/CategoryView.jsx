import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { referenceApi } from '../../api/client'
import styles from './CategoryView.module.css'

export default function CategoryView() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { lang } = useLang()
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
      navigate('/ads?category=' + encodeURIComponent(code), { replace: true })
    }
  }, [loading, notFound, category, children.length, code, navigate])

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>{lang === 'ru' ? 'Загрузка…' : 'Yuklanmoqda…'}</p>
      </div>
    )
  }

  if (notFound || !category) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>{lang === 'ru' ? 'Категория не найдена' : 'Kategoriya topilmadi'}</p>
        <Link to="/" className={styles.backLink}>{lang === 'ru' ? 'На главную' : 'Bosh sahifaga'}</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb}>
        <Link to="/">{lang === 'ru' ? 'Главная' : 'Bosh sahifa'}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{name(category)}</span>
      </nav>
      <h1 className={styles.title}>{name(category)}</h1>
      <ul className={styles.list}>
        {children.map((child) => (
          <li key={child.code}>
            {child.hasChildren ? (
              <Link to={'/categories/' + encodeURIComponent(child.code)} className={styles.card}>
                <span className={styles.cardTitle}>{name(child)}</span>
                <span className={styles.cardArrow} aria-hidden>→</span>
              </Link>
            ) : (
              <Link to={'/ads?category=' + encodeURIComponent(child.code)} className={styles.card}>
                <span className={styles.cardTitle}>{name(child)}</span>
                <span className={styles.cardHint}>{lang === 'ru' ? 'Смотреть объявления' : "E'lonlarni ko'rish"}</span>
                <span className={styles.cardArrow} aria-hidden>→</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { adminApi } from '@/api/admin'
import { UiAlert } from '@/shared/ui'
import CategoryIcon from '@/components/ui/CategoryIcon'
import AdminCategoryForm from './AdminCategoryForm'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoryError, setCategoryError] = useState('')
  const [categorySuccess, setCategorySuccess] = useState('')
  const [form, setForm] = useState({
    nameUz: '',
    nameRu: '',
    code: '',
    parentId: '',
    sortOrder: 0,
    showOnHome: false,
  })
  const [subcategoryParent, setSubcategoryParent] = useState(null)
  const [expandedIds, setExpandedIds] = useState(new Set())

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setData)
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }, [])

  const loadCategories = () => {
    setCategoriesLoading(true)
    setCategoryError('')
    adminApi
      .getCategories()
      .then((list) => setCategories(Array.isArray(list) ? list : []))
      .catch((e) => setCategoryError(e.message || 'Ошибка загрузки категорий'))
      .finally(() => setCategoriesLoading(false))
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    if (subcategoryParent != null) {
      setForm((f) => ({ ...f, parentId: String(subcategoryParent.id) }))
      setSubcategoryParent(null)
    }
  }, [subcategoryParent])

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    setCategoryError('')
    setCategorySuccess('')
    const body = {
      nameUz: form.nameUz.trim(),
      nameRu: form.nameRu.trim(),
      code: form.code.trim(),
      parentId: form.parentId ? Number(form.parentId) : null,
      sortOrder: form.sortOrder != null ? Number(form.sortOrder) : 0,
      showOnHome: form.showOnHome,
    }
    if (!body.nameUz || !body.nameRu || !body.code) {
      setCategoryError('Заполните название (UZ, RU) и код')
      return
    }
    adminApi
      .createCategory(body)
      .then(() => {
        setCategorySuccess('Категория добавлена')
        setForm({ nameUz: '', nameRu: '', code: '', parentId: '', sortOrder: 0, showOnHome: false })
        loadCategories()
      })
      .catch((e) => setCategoryError(e.message || 'Ошибка создания категории'))
  }

  const rootCategories = categories.filter((c) => c.parentId == null)
  const getChildren = (id) => categories.filter((c) => c.parentId === id)

  const renderCategoryNode = (item, depth = 0, parentCode = '') => {
    const children = getChildren(item.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedIds.has(item.id)
    return (
      <li key={item.id} className={depth === 0 ? styles.treeItem : styles.treeSubitem}>
        <div className={styles.treeItemHead}>
          <div className={styles.treeRow}>
            {hasChildren ? (
              <button
                type="button"
                className={styles.toggleBtn}
                onClick={() => toggleExpand(item.id)}
                title={isExpanded ? 'Свернуть' : 'Развернуть'}
                aria-expanded={isExpanded}
              >
                <span className={styles.chevron} data-expanded={isExpanded}>▼</span>
              </button>
            ) : (
              <span className={styles.togglePlaceholder} />
            )}
            <CategoryIcon code={item.code} parentCode={item.parentCode || parentCode} className={styles.treeIcon} />
            <span className={styles.treeName}>{item.nameRu}</span>
            <code className={styles.code}>{item.code}</code>
          </div>
          <button
            type="button"
            className={styles.subBtn}
            onClick={() => setSubcategoryParent(item)}
            title="Добавить подкатегорию"
          >
            + подкатегория
          </button>
        </div>
        {hasChildren && isExpanded && (
          <ul className={depth === 0 ? styles.treeSublist : styles.treeSublistNested}>
            {children.map((child) => renderCategoryNode(child, depth + 1, item.code))}
          </ul>
        )}
      </li>
    )
  }

  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      const idsWithChildren = categories
        .filter((c) => categories.some((child) => child.parentId === c.id))
        .map((c) => c.id)
      setExpandedIds((prev) => (prev.size === 0 ? new Set(idsWithChildren) : prev))
    }
  }, [categoriesLoading, categories])

  if (loading) {
    return (
      <div className="page-container app-page">
        <p>Загрузка…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container app-page">
        <UiAlert>{error}</UiAlert>
      </div>
    )
  }

  return (
    <div className="page-container app-page">
      <p className={styles.message}>{data?.message ?? 'Добро пожаловать в админ-панель.'}</p>

      {(data?.totalUsers != null || data?.verifiedUsers != null) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Сводка по пользователям</h2>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{data?.totalUsers ?? 0}</span>
              <span className={styles.statLabel}>Всего пользователей</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{data?.verifiedUsers ?? 0}</span>
              <span className={styles.statLabel}>Подтверждённых</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{data?.pendingVerification ?? 0}</span>
              <span className={styles.statLabel}>Ожидают проверки</span>
            </div>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Категории</h2>

        <div className={`${styles.formCard} app-card`}>
          <AdminCategoryForm
            form={form}
            setForm={setForm}
            rootCategories={rootCategories}
            getChildren={getChildren}
            error={categoryError}
            success={categorySuccess}
            onSubmit={handleCategorySubmit}
          />
        </div>

        {categoriesLoading ? (
          <p className={styles.muted}>Загрузка категорий…</p>
        ) : (
          <div className={`${styles.categoryTree} app-card`}>
            <h3 className={styles.treeTitle}>Список категорий</h3>
            {rootCategories.length === 0 ? (
              <p className={styles.muted}>Нет категорий</p>
            ) : (
              <ul className={styles.treeList}>
                {rootCategories.map((root) => renderCategoryNode(root))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { adminApi } from '../../api/client'
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

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Загрузка…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Панель администратора</h1>
      <p className={styles.message}>{data?.message ?? 'Добро пожаловать в админ-панель.'} </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Категории</h2>

        <form className={styles.form} onSubmit={handleCategorySubmit}>
          <div className={styles.formRow}>
            <label className={styles.label}>
              Название (UZ)
              <input
                type="text"
                className={styles.input}
                value={form.nameUz}
                onChange={(e) => setForm((f) => ({ ...f, nameUz: e.target.value }))}
                maxLength={100}
                placeholder="Kategoriya nomi"
              />
            </label>
            <label className={styles.label}>
              Название (RU)
              <input
                type="text"
                className={styles.input}
                value={form.nameRu}
                onChange={(e) => setForm((f) => ({ ...f, nameRu: e.target.value }))}
                maxLength={100}
                placeholder="Название категории"
              />
            </label>
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>
              Код (латиница, уникальный)
              <input
                type="text"
                className={styles.input}
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                maxLength={50}
                placeholder="category-code"
              />
            </label>
            <label className={styles.label}>
              Родительская категория (для подкатегории)
              <select
                className={styles.select}
                value={form.parentId}
                onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
              >
                <option value="">— корневая —</option>
                {rootCategories.flatMap((root) => [
                  <option key={root.id} value={root.id}>
                    {root.nameRu} ({root.code})
                  </option>,
                  ...getChildren(root.id).map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      — {sub.nameRu} ({sub.code})
                    </option>
                  )),
                ])}
              </select>
            </label>
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>
              Порядок сортировки
              <input
                type="number"
                className={styles.inputNum}
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value === '' ? 0 : Number(e.target.value) }))}
              />
            </label>
            <label className={styles.checkWrap}>
              <input
                type="checkbox"
                checked={form.showOnHome}
                onChange={(e) => setForm((f) => ({ ...f, showOnHome: e.target.checked }))}
              />
              <span>Показывать на главной</span>
            </label>
          </div>
          {categoryError && <p className={styles.error}>{categoryError}</p>}
          {categorySuccess && <p className={styles.success}>{categorySuccess}</p>}
          <button type="submit" className={styles.submitBtn}>
            Добавить категорию
          </button>
        </form>

        {categoriesLoading ? (
          <p className={styles.muted}>Загрузка категорий…</p>
        ) : (
          <div className={styles.categoryTree}>
            <p className={styles.treeTitle}>Список категорий</p>
            {rootCategories.length === 0 ? (
              <p className={styles.muted}>Нет категорий</p>
            ) : (
              <ul className={styles.treeList}>
                {rootCategories.map((root) => (
                  <li key={root.id} className={styles.treeItem}>
                    <span className={styles.treeName}>
                      {root.nameRu} <code className={styles.code}>{root.code}</code>
                    </span>
                    <button
                      type="button"
                      className={styles.subBtn}
                      onClick={() => setSubcategoryParent(root)}
                      title="Добавить подкатегорию"
                    >
                      + подкатегория
                    </button>
                    {getChildren(root.id).length > 0 && (
                      <ul className={styles.treeSublist}>
                        {getChildren(root.id).map((sub) => (
                          <li key={sub.id} className={styles.treeSubitem}>
                            <span className={styles.treeName}>
                              {sub.nameRu} <code className={styles.code}>{sub.code}</code>
                            </span>
                            <button
                              type="button"
                              className={styles.subBtn}
                              onClick={() => setSubcategoryParent(sub)}
                              title="Добавить подкатегорию"
                            >
                              + подкатегория
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { adminApi } from '@/api/admin'

export default function useAdminCategories(t) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    nameUz: '',
    nameRu: '',
    code: '',
    parentId: '',
    sortOrder: 0,
    showOnHome: false,
  })
  const [expandedIds, setExpandedIds] = useState(new Set())

  const load = () => {
    setLoading(true)
    setError('')
    adminApi
      .getCategories()
      .then((list) => setCategories(Array.isArray(list) ? list : []))
      .catch((e) => setError(e.message || t('adminPanel.loading')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!loading && categories.length > 0) {
      const idsWithChildren = categories
        .filter((c) => categories.some((child) => child.parentId === c.id))
        .map((c) => c.id)
      setExpandedIds((prev) => (prev.size === 0 ? new Set(idsWithChildren) : prev))
    }
  }, [loading, categories])

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const body = {
      nameUz: form.nameUz.trim(),
      nameRu: form.nameRu.trim(),
      code: form.code.trim(),
      parentId: form.parentId ? Number(form.parentId) : null,
      sortOrder: form.sortOrder != null ? Number(form.sortOrder) : 0,
      showOnHome: form.showOnHome,
    }
    if (!body.nameUz || !body.nameRu || !body.code) {
      setError(t('adminPanel.fillCategory'))
      return
    }
    adminApi
      .createCategory(body)
      .then(() => {
        setSuccess(t('adminPanel.categoryAdded'))
        setForm({ nameUz: '', nameRu: '', code: '', parentId: '', sortOrder: 0, showOnHome: false })
        load()
      })
      .catch((e) => setError(e.message || t('adminPanel.fillCategory')))
  }

  const addSubcategory = (item) => {
    setForm((f) => ({ ...f, parentId: String(item.id) }))
  }

  const rootCategories = categories.filter((c) => c.parentId == null)
  const getChildren = (id) => categories.filter((c) => c.parentId === id)

  return {
    form,
    setForm,
    error,
    success,
    loading,
    rootCategories,
    getChildren,
    expandedIds,
    toggleExpand,
    submit,
    addSubcategory,
  }
}

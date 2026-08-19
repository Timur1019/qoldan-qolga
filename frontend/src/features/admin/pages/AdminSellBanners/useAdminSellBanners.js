import { useEffect, useState } from 'react'
import { adminApi } from '@/api/admin'
import { adsApi } from '@/api/ads'

const EMPTY = {
  kicker: 'Qoldan Qolga',
  title: '',
  subtitle: '',
  ctaText: 'Подать объявление',
  ctaUrl: '/ads/create',
  imageUrl: '',
  enabled: true,
  sortOrder: 0,
}

export default function useAdminSellBanners() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [uploading, setUploading] = useState(false)

  const load = () => {
    setLoading(true)
    setError('')
    adminApi
      .getHomeSellBanners()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const save = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const body = {
      kicker: form.kicker.trim() || null,
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      ctaText: form.ctaText.trim() || null,
      ctaUrl: form.ctaUrl.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      enabled: Boolean(form.enabled),
      sortOrder: Number(form.sortOrder) || 0,
    }
    if (!body.title) {
      setError('Заполните заголовок')
      return
    }
    const req = editingId
      ? adminApi.updateHomeSellBanner(editingId, body)
      : adminApi.createHomeSellBanner(body)
    req
      .then(() => {
        setSuccess(editingId ? 'Баннер обновлён' : 'Баннер добавлен')
        setEditingId(null)
        setForm(EMPTY)
        load()
      })
      .catch((err) => setError(err.message || 'Ошибка сохранения'))
  }

  const remove = (id) => {
    if (!window.confirm('Удалить этот баннер?')) return
    setError('')
    adminApi
      .deleteHomeSellBanner(id)
      .then(() => {
        setSuccess('Баннер удалён')
        if (editingId === id) {
          setEditingId(null)
          setForm(EMPTY)
        }
        load()
      })
      .catch((e) => setError(e.message || 'Ошибка удаления'))
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm({
      kicker: item.kicker || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      ctaText: item.ctaText || '',
      ctaUrl: item.ctaUrl || '',
      imageUrl: item.imageUrl || '',
      enabled: item.enabled !== false,
      sortOrder: item.sortOrder ?? 0,
    })
    setSuccess('')
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(EMPTY)
  }

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const data = await adsApi.upload(file)
      if (data?.url) setForm((f) => ({ ...f, imageUrl: data.url }))
    } catch (err) {
      setError(err.message || 'Ошибка загрузки изображения')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return {
    list,
    loading,
    error,
    success,
    editingId,
    form,
    setForm,
    uploading,
    save,
    remove,
    startEdit,
    cancelEdit,
    uploadImage,
  }
}

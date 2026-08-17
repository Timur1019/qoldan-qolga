import { useState, useEffect } from 'react'
import { imageUrl } from '@/api/client'
import { adminApi } from '@/api/admin'
import { adsApi } from '@/api/ads'
import { UiAlert, UiButton } from '@/shared/ui'
import AdminBannerForm from './AdminBannerForm'
import styles from './AdminBanners.module.css'

const emptyForm = () => ({
  title: '',
  subtitle: '',
  badge: '',
  link: '',
  imageUrl: '',
  sortOrder: 0,
})

export default function AdminBanners() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [uploading, setUploading] = useState(false)

  const load = () => {
    setLoading(true)
    setError('')
    adminApi
      .getHomePromoBanners()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message || 'Ошибка загрузки'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const body = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      badge: form.badge.trim() || null,
      link: form.link.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      sortOrder: Number(form.sortOrder) || 0,
    }
    if (!body.title) {
      setError('Заполните заголовок')
      return
    }
    if (editingId) {
      adminApi
        .updateHomePromoBanner(editingId, body)
        .then(() => {
          setSuccess('Баннер обновлён')
          setEditingId(null)
          setForm(emptyForm())
          load()
        })
        .catch((e) => setError(e.message || 'Ошибка обновления'))
    } else {
      adminApi
        .createHomePromoBanner(body)
        .then(() => {
          setSuccess('Баннер добавлен')
          setForm(emptyForm())
          load()
        })
        .catch((e) => setError(e.message || 'Ошибка создания'))
    }
  }

  const handleDelete = (id) => {
    if (!window.confirm('Удалить этот баннер?')) return
    setError('')
    adminApi
      .deleteHomePromoBanner(id)
      .then(() => {
        setSuccess('Баннер удалён')
        if (editingId === id) {
          setEditingId(null)
          setForm(emptyForm())
        }
        load()
      })
      .catch((e) => setError(e.message || 'Ошибка удаления'))
  }

  const startEdit = (banner) => {
    setEditingId(banner.id)
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      link: banner.link || '',
      imageUrl: banner.imageUrl || '',
      sortOrder: banner.sortOrder ?? 0,
    })
    setSuccess('')
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm())
  }

  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const data = await adsApi.upload(file)
      const url = data?.url
      if (url) setForm((f) => ({ ...f, imageUrl: url }))
    } catch (err) {
      setError(err.message || 'Ошибка загрузки изображения')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Баннеры «Выгодно и полезно»</h1>
      <p className={styles.muted}>
        Эти карточки отображаются на главной странице. Можно задать фоновое фото для каждой карточки.
      </p>

      {loading ? <p className={styles.loading}>Загрузка…</p> : null}
      {error ? <UiAlert>{error}</UiAlert> : null}
      {success ? <UiAlert variant="success">{success}</UiAlert> : null}

      <div className={styles.list}>
        {list.map((b) => (
          <div key={b.id} className={styles.card}>
            <div
              className={styles.cardBg}
              style={b.imageUrl ? { backgroundImage: `url(${imageUrl(b.imageUrl)})` } : undefined}
            />
            <div className={styles.cardBody}>
              <span className={styles.cardBadge}>{b.badge || '—'}</span>
              <strong className={styles.cardTitle}>{b.title}</strong>
              <p className={styles.cardSubtitle}>{b.subtitle || '—'}</p>
              <div className={styles.cardActions}>
                <UiButton type="button" variant="outline" size="sm" onClick={() => startEdit(b)}>
                  Изменить
                </UiButton>
                <UiButton type="button" variant="danger" size="sm" onClick={() => handleDelete(b.id)}>
                  Удалить
                </UiButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminBannerForm
        form={form}
        setForm={setForm}
        editingId={editingId}
        uploading={uploading}
        onSubmit={handleSubmit}
        onCancel={cancelEdit}
        onFileChange={onFileChange}
      />
    </div>
  )
}

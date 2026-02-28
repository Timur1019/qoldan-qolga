import { useState, useEffect } from 'react'
import { adminApi, adsApi, imageUrl } from '../../api/client'
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

      {loading && <p className={styles.loading}>Загрузка…</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {success && <p className={styles.success} role="status">{success}</p>}

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
                <button type="button" className={styles.btnEdit} onClick={() => startEdit(b)}>
                  Изменить
                </button>
                <button type="button" className={styles.btnDel} onClick={() => handleDelete(b.id)}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>{editingId ? 'Редактировать баннер' : 'Добавить баннер'}</h2>
        <label className={styles.label}>
          Заголовок *
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={styles.input}
            maxLength={200}
            required
          />
        </label>
        <label className={styles.label}>
          Подзаголовок
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            className={styles.input}
            maxLength={500}
          />
        </label>
        <label className={styles.label}>
          Бейдж (метка)
          <input
            type="text"
            value={form.badge}
            onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
            className={styles.input}
            maxLength={100}
            placeholder="Например: Безопасно"
          />
        </label>
        <label className={styles.label}>
          Ссылка
          <input
            type="text"
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            className={styles.input}
            maxLength={500}
            placeholder="/dashboard/ads или https://..."
          />
        </label>
        <label className={styles.label}>
          Фото фона (URL или загрузка)
          <div className={styles.imageRow}>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              className={styles.input}
              placeholder="/uploads/xxx.jpg или ссылка"
            />
            <label className={styles.uploadBtn}>
              <input type="file" accept="image/*" onChange={onFileChange} disabled={uploading} className={styles.hidden} />
              {uploading ? '…' : 'Загрузить'}
            </label>
          </div>
        </label>
        <label className={styles.label}>
          Порядок (число)
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            className={styles.input}
            min={0}
          />
        </label>
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>
            {editingId ? 'Сохранить' : 'Добавить'}
          </button>
          {editingId && (
            <button type="button" className={styles.btnSecondary} onClick={cancelEdit}>
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

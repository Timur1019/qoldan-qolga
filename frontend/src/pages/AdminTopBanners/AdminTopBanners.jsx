import { useEffect, useState } from 'react'
import { adminApi, adsApi, imageUrl } from '../../api/client'
import styles from './AdminTopBanners.module.css'

const emptyForm = () => ({
  title: '',
  linkText: 'Подробнее',
  linkUrl: '',
  iconUrl: '',
  enabled: true,
  sortOrder: 0,
})

export default function AdminTopBanners() {
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
      .getSiteTopBanners()
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
      linkText: form.linkText.trim() || null,
      linkUrl: form.linkUrl.trim() || null,
      iconUrl: form.iconUrl.trim() || null,
      enabled: Boolean(form.enabled),
      sortOrder: Number(form.sortOrder) || 0,
    }
    if (!body.title) {
      setError('Заполните текст')
      return
    }
    const req = editingId
      ? adminApi.updateSiteTopBanner(editingId, body)
      : adminApi.createSiteTopBanner(body)
    req
      .then(() => {
        setSuccess(editingId ? 'Реклама обновлена' : 'Реклама добавлена')
        setEditingId(null)
        setForm(emptyForm())
        load()
      })
      .catch((err) => setError(err.message || 'Ошибка сохранения'))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Удалить эту рекламу?')) return
    setError('')
    adminApi
      .deleteSiteTopBanner(id)
      .then(() => {
        setSuccess('Реклама удалена')
        if (editingId === id) {
          setEditingId(null)
          setForm(emptyForm())
        }
        load()
      })
      .catch((e) => setError(e.message || 'Ошибка удаления'))
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      linkText: item.linkText || 'Подробнее',
      linkUrl: item.linkUrl || '',
      iconUrl: item.iconUrl || '',
      enabled: item.enabled !== false,
      sortOrder: item.sortOrder ?? 0,
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
      if (url) setForm((f) => ({ ...f, iconUrl: url }))
    } catch (err) {
      setError(err.message || 'Ошибка загрузки иконки')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Реклама в шапке</h1>
      <p className={styles.muted}>
        Узкая полоса над шапкой сайта (как у Авито). Включите нужную запись — она появится у всех
        посетителей. Закрытие крестиком скрывает баннер только у этого пользователя.
      </p>

      {loading && <p className={styles.loading}>Загрузка…</p>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className={styles.success} role="status">
          {success}
        </p>
      )}

      <div className={styles.list}>
        {list.map((b) => (
          <div key={b.id} className={styles.card}>
            <div className={styles.preview}>
              {b.iconUrl ? (
                <img src={imageUrl(b.iconUrl)} alt="" className={styles.previewIcon} />
              ) : (
                <span className={styles.previewIconFallback} aria-hidden>
                  <i className="bi bi-megaphone" />
                </span>
              )}
              <div className={styles.previewText}>
                <strong>{b.title}</strong>
                {b.linkUrl && <span className={styles.previewLink}>{b.linkText || 'Подробнее'}</span>}
              </div>
              <span className={b.enabled ? styles.badgeOn : styles.badgeOff}>
                {b.enabled ? 'Вкл' : 'Выкл'}
              </span>
            </div>
            <div className={styles.cardActions}>
              <button type="button" className={styles.btnEdit} onClick={() => startEdit(b)}>
                Изменить
              </button>
              <button type="button" className={styles.btnDel} onClick={() => handleDelete(b.id)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
        {!loading && list.length === 0 && (
          <p className={styles.empty}>Пока нет записей — добавьте ниже.</p>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>{editingId ? 'Редактировать' : 'Добавить рекламу'}</h2>
        <label className={styles.label}>
          Текст *
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={styles.input}
            maxLength={300}
            required
            placeholder="Как дальше пользоваться Qoldan Qolga на iOS."
          />
        </label>
        <label className={styles.label}>
          Текст ссылки
          <input
            type="text"
            value={form.linkText}
            onChange={(e) => setForm((f) => ({ ...f, linkText: e.target.value }))}
            className={styles.input}
            maxLength={100}
            placeholder="Подробнее"
          />
        </label>
        <label className={styles.label}>
          Ссылка
          <input
            type="text"
            value={form.linkUrl}
            onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
            className={styles.input}
            maxLength={500}
            placeholder="/about или https://..."
          />
        </label>
        <label className={styles.label}>
          Иконка (URL или загрузка)
          <div className={styles.imageRow}>
            <input
              type="text"
              value={form.iconUrl}
              onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value }))}
              className={styles.input}
              placeholder="/uploads/xxx.png"
            />
            <label className={styles.uploadBtn}>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                disabled={uploading}
                className={styles.hidden}
              />
              {uploading ? '…' : 'Загрузить'}
            </label>
          </div>
        </label>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
          />
          Показывать на сайте
        </label>
        <label className={styles.label}>
          Порядок
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

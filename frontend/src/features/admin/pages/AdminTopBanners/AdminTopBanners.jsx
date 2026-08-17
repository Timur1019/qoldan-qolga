import { useEffect, useState } from 'react'
import { imageUrl } from '@/api/client'
import { adminApi } from '@/api/admin'
import { adsApi } from '@/api/ads'
import { UiAlert, UiButton } from '@/shared/ui'
import AdminTopBannerForm from './AdminTopBannerForm'
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

      {loading ? <p className={styles.loading}>Загрузка…</p> : null}
      {error ? <UiAlert>{error}</UiAlert> : null}
      {success ? <UiAlert variant="success">{success}</UiAlert> : null}

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
              <UiButton type="button" variant="outline" size="sm" onClick={() => startEdit(b)}>
                Изменить
              </UiButton>
              <UiButton type="button" variant="danger" size="sm" onClick={() => handleDelete(b.id)}>
                Удалить
              </UiButton>
            </div>
          </div>
        ))}
        {!loading && list.length === 0 && (
          <p className={styles.empty}>Пока нет записей — добавьте ниже.</p>
        )}
      </div>

      <AdminTopBannerForm
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

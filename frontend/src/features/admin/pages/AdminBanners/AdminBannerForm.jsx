import { useRef } from 'react'
import { UiButton, UiField, UiInput } from '@/shared/ui'
import styles from './AdminBanners.module.css'

export default function AdminBannerForm({
  form,
  setForm,
  editingId,
  uploading,
  onSubmit,
  onCancel,
  onFileChange,
}) {
  const fileRef = useRef(null)

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <h2 className={styles.formTitle}>{editingId ? 'Редактировать баннер' : 'Добавить баннер'}</h2>
      <UiField label="Заголовок *" htmlFor="banner-title">
        <UiInput
          id="banner-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          maxLength={200}
          required
        />
      </UiField>
      <UiField label="Подзаголовок" htmlFor="banner-subtitle">
        <UiInput
          id="banner-subtitle"
          value={form.subtitle}
          onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          maxLength={500}
        />
      </UiField>
      <UiField label="Бейдж (метка)" htmlFor="banner-badge">
        <UiInput
          id="banner-badge"
          value={form.badge}
          onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
          maxLength={100}
          placeholder="Например: Безопасно"
        />
      </UiField>
      <UiField label="Ссылка" htmlFor="banner-link">
        <UiInput
          id="banner-link"
          value={form.link}
          onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          maxLength={500}
          placeholder="/dashboard/ads или https://..."
        />
      </UiField>
      <UiField label="Фото фона (URL или загрузка)" htmlFor="banner-image">
        <div className={styles.imageRow}>
          <UiInput
            id="banner-image"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="/uploads/xxx.jpg или ссылка"
          />
          <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className={styles.hidden} />
          <UiButton type="button" variant="outline" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? '…' : 'Загрузить'}
          </UiButton>
        </div>
      </UiField>
      <UiField label="Порядок (число)" htmlFor="banner-sort">
        <UiInput
          id="banner-sort"
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
          min={0}
        />
      </UiField>
      <div className={styles.formActions}>
        <UiButton type="submit">{editingId ? 'Сохранить' : 'Добавить'}</UiButton>
        {editingId ? (
          <UiButton type="button" variant="ghost" onClick={onCancel}>Отмена</UiButton>
        ) : null}
      </div>
    </form>
  )
}

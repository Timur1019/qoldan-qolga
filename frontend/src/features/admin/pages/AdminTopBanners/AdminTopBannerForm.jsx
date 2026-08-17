import { useRef } from 'react'
import { UiButton, UiField, UiInput, UiToggle } from '@/shared/ui'
import styles from './AdminTopBanners.module.css'

export default function AdminTopBannerForm({
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
      <h2 className={styles.formTitle}>{editingId ? 'Редактировать' : 'Добавить рекламу'}</h2>
      <UiField label="Текст *" htmlFor="top-title">
        <UiInput
          id="top-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          maxLength={300}
          required
          placeholder="Как дальше пользоваться Qoldan Qolga на iOS."
        />
      </UiField>
      <UiField label="Текст ссылки" htmlFor="top-link-text">
        <UiInput
          id="top-link-text"
          value={form.linkText}
          onChange={(e) => setForm((f) => ({ ...f, linkText: e.target.value }))}
          maxLength={100}
          placeholder="Подробнее"
        />
      </UiField>
      <UiField label="Ссылка" htmlFor="top-link-url">
        <UiInput
          id="top-link-url"
          value={form.linkUrl}
          onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
          maxLength={500}
          placeholder="/about или https://..."
        />
      </UiField>
      <UiField label="Иконка (URL или загрузка)" htmlFor="top-icon">
        <div className={styles.imageRow}>
          <UiInput
            id="top-icon"
            value={form.iconUrl}
            onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value }))}
            placeholder="/uploads/xxx.png"
          />
          <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className={styles.hidden} />
          <UiButton type="button" variant="outline" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? '…' : 'Загрузить'}
          </UiButton>
        </div>
      </UiField>
      <div className={styles.checkLabel}>
        <UiToggle
          checked={form.enabled}
          onChange={(enabled) => setForm((f) => ({ ...f, enabled }))}
        />
        Показывать на сайте
      </div>
      <UiField label="Порядок" htmlFor="top-sort">
        <UiInput
          id="top-sort"
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

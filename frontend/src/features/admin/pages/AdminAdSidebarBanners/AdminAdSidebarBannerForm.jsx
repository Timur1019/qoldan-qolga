import { useRef } from 'react'
import { UiButton, UiField, UiInput, UiToggle } from '@/shared/ui'
import styles from './AdminAdSidebarBanners.module.css'

export default function AdminAdSidebarBannerForm({
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
      <h2 className={styles.formTitle}>{editingId ? 'Редактировать' : 'Добавить баннер'}</h2>
      <UiField label="Название (для себя)" htmlFor="side-title">
        <UiInput
          id="side-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          maxLength={200}
          placeholder="Реклама бизнеса"
        />
      </UiField>
      <UiField label="Ссылка *" htmlFor="side-link">
        <UiInput
          id="side-link"
          value={form.linkUrl}
          onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
          maxLength={500}
          required
          placeholder="https://… или /business"
        />
      </UiField>
      <UiField label="Картинка *" htmlFor="side-image">
        <div className={styles.imageRow}>
          <UiInput
            id="side-image"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="/uploads/banner.png"
            required
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
      <UiField label="Порядок (меньше — выше)" htmlFor="side-sort">
        <UiInput
          id="side-sort"
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

import { useRef } from 'react'
import { UiButton, UiField, UiInput, UiToggle } from '@/shared/ui'
import styles from './AdminSellBanners.module.css'

export default function AdminSellBannerForm({
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
      <UiField label="Надзаголовок" htmlFor="sell-kicker">
        <UiInput
          id="sell-kicker"
          value={form.kicker}
          onChange={(e) => setForm((f) => ({ ...f, kicker: e.target.value }))}
          maxLength={120}
          placeholder="Qoldan Qolga"
        />
      </UiField>
      <UiField label="Заголовок *" htmlFor="sell-title">
        <UiInput
          id="sell-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          maxLength={300}
          required
          placeholder="Продавайте и зарабатывайте"
        />
      </UiField>
      <UiField label="Подзаголовок" htmlFor="sell-subtitle">
        <UiInput
          id="sell-subtitle"
          value={form.subtitle}
          onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          maxLength={500}
          placeholder="Отзывы повышают доверие…"
        />
      </UiField>
      <UiField label="Текст кнопки" htmlFor="sell-cta-text">
        <UiInput
          id="sell-cta-text"
          value={form.ctaText}
          onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
          maxLength={120}
          placeholder="Подать объявление"
        />
      </UiField>
      <UiField label="Ссылка кнопки" htmlFor="sell-cta-url">
        <UiInput
          id="sell-cta-url"
          value={form.ctaUrl}
          onChange={(e) => setForm((f) => ({ ...f, ctaUrl: e.target.value }))}
          maxLength={500}
          placeholder="/ads/create"
        />
      </UiField>
      <UiField label="Картинка справа (URL или загрузка)" htmlFor="sell-image">
        <div className={styles.imageRow}>
          <UiInput
            id="sell-image"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
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
      <UiField label="Порядок" htmlFor="sell-sort">
        <UiInput
          id="sell-sort"
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

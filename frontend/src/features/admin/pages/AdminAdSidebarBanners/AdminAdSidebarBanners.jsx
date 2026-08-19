import { UiAlert } from '@/shared/ui'
import AdminAdSidebarBannerForm from './AdminAdSidebarBannerForm'
import AdminAdSidebarBannerCard from './AdminAdSidebarBannerCard'
import useAdminAdSidebarBanners from './useAdminAdSidebarBanners'
import styles from './AdminAdSidebarBanners.module.css'

export default function AdminAdSidebarBanners() {
  const banners = useAdminAdSidebarBanners()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Реклама в карточке</h1>
      <p className={styles.muted}>
        Справа на странице объявления показываются 1 или 2 включённых баннера (по порядку).
        Загрузите вертикальную картинку и укажите ссылку.
      </p>

      {banners.loading ? <p className={styles.loading}>Загрузка…</p> : null}
      {banners.error ? <UiAlert>{banners.error}</UiAlert> : null}
      {banners.success ? <UiAlert variant="success">{banners.success}</UiAlert> : null}

      <div className={styles.list}>
        {banners.list.map((item) => (
          <AdminAdSidebarBannerCard
            key={item.id}
            item={item}
            onEdit={banners.startEdit}
            onDelete={banners.remove}
          />
        ))}
        {!banners.loading && banners.list.length === 0 && (
          <p className={styles.empty}>Пока нет записей — добавьте ниже.</p>
        )}
      </div>

      <AdminAdSidebarBannerForm
        form={banners.form}
        setForm={banners.setForm}
        editingId={banners.editingId}
        uploading={banners.uploading}
        onSubmit={banners.save}
        onCancel={banners.cancelEdit}
        onFileChange={banners.uploadImage}
      />
    </div>
  )
}

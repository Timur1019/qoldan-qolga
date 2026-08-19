import { UiAlert } from '@/shared/ui'
import AdminSellBannerForm from './AdminSellBannerForm'
import AdminSellBannerCard from './AdminSellBannerCard'
import useAdminSellBanners from './useAdminSellBanners'
import styles from './AdminSellBanners.module.css'

export default function AdminSellBanners() {
  const banners = useAdminSellBanners()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Баннер «Продавайте»</h1>
      <p className={styles.muted}>
        Зелёный блок на главной и в ленте объявлений. Включите одну запись — она появится у всех
        посетителей. Если выключить все, баннер скроется.
      </p>

      {banners.loading ? <p className={styles.loading}>Загрузка…</p> : null}
      {banners.error ? <UiAlert>{banners.error}</UiAlert> : null}
      {banners.success ? <UiAlert variant="success">{banners.success}</UiAlert> : null}

      <div className={styles.list}>
        {banners.list.map((item) => (
          <AdminSellBannerCard
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

      <AdminSellBannerForm
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

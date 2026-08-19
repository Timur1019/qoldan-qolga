import { imageUrl } from '@/api/client'
import { UiButton } from '@/shared/ui'
import styles from './AdminAdSidebarBanners.module.css'

export default function AdminAdSidebarBannerCard({ item, onEdit, onDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.preview}>
        {item.imageUrl ? (
          <img src={imageUrl(item.imageUrl)} alt="" className={styles.previewArt} />
        ) : (
          <span className={styles.previewArtFallback} aria-hidden>
            <i className="bi bi-image" />
          </span>
        )}
        <div className={styles.previewText}>
          <strong>{item.title || 'Без названия'}</strong>
          <span className={styles.previewLink}>{item.linkUrl}</span>
        </div>
        <span className={item.enabled ? styles.badgeOn : styles.badgeOff}>
          {item.enabled ? 'Вкл' : 'Выкл'}
        </span>
      </div>
      <div className={styles.cardActions}>
        <UiButton type="button" variant="outline" size="sm" onClick={() => onEdit(item)}>
          Изменить
        </UiButton>
        <UiButton type="button" variant="danger" size="sm" onClick={() => onDelete(item.id)}>
          Удалить
        </UiButton>
      </div>
    </div>
  )
}
